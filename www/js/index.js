function writeTag(nfcEvent) {
  var mimeType = document.forms[0].elements["mimeType"].value,
    payload = document.forms[0].elements["payload"].value,
    record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));
    mimeMedia = document.getElementsByName("tnf-1")[0].checked

    console.log(mimeMedia);

    if (mimeMedia) {
        nfc.write(
            [record],
            function () {
                window.plugins.toast.showShortBottom("Записано");
                navigator.notification.vibrate(100);
            },
            function (reason) {
                navigator.notification.alert(reason, function() {}, "Възникна грешка");
            }
        );
    } else {
        if (mimeType === 'T') {
            var message = [
              ndef.textRecord(payload)
          ];
        } else {
            var message = [
              ndef.uriRecord(payload)
          ];
        }

        nfc.write(
            message,
            function () {
                window.plugins.toast.showShortBottom("Записано");
                navigator.notification.vibrate(100);
            },
            function (reason) {
                navigator.notification.alert(reason, function() {}, "Възникна грешка");
            }
        );
    }

}


const writeScreenID = 4;
var app = {
    initialize: function () {
        this.bind();
        app.activeScreen = 1;
        app.activeWriteScreen = null;

        document.getElementById(`screen-${this.activeScreen}`).style.display = 'block';
    },
    next: function () {
        document.getElementById(`screen-${app.activeScreen}`).style.display = 'none';
        app.activeScreen++;
        window.scroll({ top: 0 });
        document.getElementById(`screen-${app.activeScreen}`).style.display = 'block';
    },
    prev: function () {
        document.getElementById(`screen-${app.activeScreen}`).style.display = 'none';
        app.activeScreen--;
        window.scroll({ top: 0 });
        document.getElementById(`screen-${app.activeScreen}`).style.display = 'block';
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);

        var butnNext = document.querySelectorAll('.btn-next');
        var butnPrev = document.querySelectorAll('.btn-prev');

        butnNext.forEach(function (elem) {
            elem.addEventListener("click", app.next, false);
        });
        butnPrev.forEach(function (elem) {
            elem.addEventListener("click", app.prev, false);
        });
    },
    deviceready: function () {
        function failure(reason) {
            navigator.notification.alert(reason, function() {}, "Възникна грешка");
        }

        document.getElementById('checkbox').addEventListener('change', app.toggleCheckbox, false);
        nfc.addTagDiscoveredListener(writeTag, () => {}, failure);

        nfc.addNdefListener(
            event => app.activeScreen == writeScreenID ? writeTag(event) : app.onNdef(event),
            function() {
                console.log("Listening for NDEF tags.");
            },
            err => console.log(err)
        );

        if (device.platform == "Android") {

            // Android reads non-NDEF tag. BlackBerry and Windows don't.
            nfc.addTagDiscoveredListener(
                event => app.activeScreen == writeScreenID ? writeTag(event) : app.onNdef(event),
                function() {
                    console.log("Listening for non-NDEF tags.");
                },
                err => console.log(err)
            );

            // Android launches the app when tags with mime type text/pg are scanned
            // because of an intent in AndroidManifest.xml.
            // phonegap-nfc fires an ndef-mime event (as opposed to an ndef event)
            // the code reuses the same onNfc handler
            nfc.addMimeTypeListener(
                'text/pg',
                event => app.activeScreen == writeScreenID ? writeTag(event) : app.onNdef(event),
                function() {
                    console.log("Listening for NDEF mime tags with type text/pg.");
                },
                failure
            );
        }

        app.compileTemplates();
        app.addTemplateHelpers();
        app.showInstructions();
    },
    onNfc: function (nfcEvent) {

        var tag = nfcEvent.tag;

        console.log(JSON.stringify(nfcEvent.tag));
        app.clearScreen();

        tagContents.innerHTML = app.nonNdefTagTemplate(tag);
        navigator.notification.vibrate(100);
    },
    onNdef: function (nfcEvent) {

        console.log(JSON.stringify(nfcEvent.tag));
        app.clearScreen();

        var tag = nfcEvent.tag;

        // BB7 has different names, copy to Android names
        if (tag.serialNumber) {
            tag.id = tag.serialNumber;
            tag.isWritable = !tag.isLocked;
            tag.canMakeReadOnly = tag.isLockable;
        }

        tagContents.innerHTML = app.tagTemplate(tag);

        navigator.notification.vibrate(100);
    },
    clearScreen: function () {
        tagContents.innerHTML = "";
    },
    showInstructions: function () {
        var hidden = document.getElementsByClassName('hidden');
        if (hidden && hidden.length) {
            hidden[0].className = 'instructions';
        }
    },
    compileTemplates: function () {
        var source;

        source = document.getElementById('non-ndef-template').innerHTML;
        app.nonNdefTagTemplate = Handlebars.compile(source);

        source = document.getElementById('tag-template').innerHTML;
        app.tagTemplate = Handlebars.compile(source);

    },
    addTemplateHelpers: function () {
        Handlebars.registerHelper('bytesToString', function(byteArray) {
            return nfc.bytesToString(byteArray);
        });

        Handlebars.registerHelper('bytesToHexString', function(byteArray) {
            return nfc.bytesToHexString(byteArray);
        });

        // useful for boolean
        Handlebars.registerHelper('toString', function(value) {
            return String(value);
        });

        Handlebars.registerHelper('tnfToString', function(tnf) {
            return tnfToString(tnf);
        });

        Handlebars.registerHelper('decodePayload', function(record) {
            return decodePayload(record);
        });

        Handlebars.registerHelper('pluralize', function(number, single, plural) {
          if (number === 1) { return single; }
          else { return plural; }
        });
    },
    disableUI: function () {
        document.forms[0].elements.mimeType.disabled = true;
        document.forms[0].elements.payload.disabled = true;
    },
    enableUI: function () {
        document.forms[0].elements.mimeType.disabled = false;
        document.forms[0].elements.payload.disabled = false;
    },
    toggleCheckbox: function (e) {
        if (e.target.checked) {
            app.shareMessage();
        } else {
            app.unshareMessage();
        }
    },
    shareMessage: function () {
        var mimeType = document.forms[1].elements.mimeType.value,
            payload = document.forms[1].elements.payload.value,
            record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));
        var mimeMedia = document.getElementsByName("tnf-2")[0].checked

        if (!mimeMedia) {
            if (mimeType === 'U') {
                var record = ndef.uriRecord(payload);
            } else {
                var record = ndef.textRecord(payload);
            }
        }

        app.disableUI();

        nfc.share(
            [record],
            function () {
                // Android call the success callback when the message is sent to peer
                navigator.notification.vibrate(100);
                window.plugins.toast.showShortBottom("Съобщението се споделя.");
            },
            function (reason) {
                navigator.notification.alert(reason, function() {}, "Възникна грешка");
                checkbox.checked = false;
                app.enableUI();
            }
        );
        },
        unshareMessage: function () {
            app.enableUI();

            nfc.unshare(
                function () {
                    navigator.notification.vibrate(100);
                    window.plugins.toast.showShortBottom("Съобщението не се споделя.");
                }, function (reason) {
                    navigator.notification.alert(reason, function() {}, "Възникна грешка!");
                }
            );
        }
};

// ideally some form of this can move to phonegap-nfc util
function decodePayload(record) {
    var recordType = nfc.bytesToString(record.type),
        payload;

    // TODO extract this out to decoders that live in NFC code
    // TODO add a method to ndefRecord so the helper
    // TODO doesn't need to do this

    if (recordType === "T") {
        var langCodeLength = record.payload[0],
        text = record.payload.slice((1 + langCodeLength), record.payload.length);
        payload = nfc.bytesToString(text);

    } else if (recordType === "U") {
        var identifierCode = record.payload.shift(),
        uri =  nfc.bytesToString(record.payload);

        if (identifierCode !== 0) {
            // TODO decode based on URI Record Type Definition
            console.log("WARNING: uri needs to be decoded");
        }
        //payload = "<a href='" + uri + "'>" + uri + "<\/a>";
        payload = uri;

    } else {

        // kludge assume we can treat as String
        payload = nfc.bytesToString(record.payload);
    }

    console.log(payload, record);
    return payload;
}

// TODO move to phonegap-nfc util
function tnfToString(tnf) {
    var value = tnf;

    switch (tnf) {
    case ndef.TNF_EMPTY:
        value = "Empty";
        break;
    case ndef.TNF_WELL_KNOWN:
        value = "Well Known";
        break;
    case ndef.TNF_MIME_MEDIA:
        value = "Mime Media";
        break;
    case ndef.TNF_ABSOLUTE_URI:
        value = "Absolute URI";
        break;
    case ndef.TNF_EXTERNAL_TYPE:
        value = "External";
        break;
    case ndef.TNF_UNKNOWN:
        value = "Unknown";
        break;
    case ndef.TNF_UNCHANGED:
        value = "Unchanged";
        break;
    case ndef.TNF_RESERVED:
        value = "Reserved";
        break;
    }
    return value;
}
