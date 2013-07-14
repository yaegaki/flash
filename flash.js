(function (window) {
    var _flash =  window.flash || (window.flash = function (bin) {
        var pos = 0;
        this.Signature = BC.ToAscii(bin, pos++) + BC.ToAscii(bin, pos++) + BC.ToAscii(bin, pos++);
        this.Composed = (this.Signature[0] == "C") ? true : false;
        this.Version = BC.ToUInt8(bin, pos++);
        this.FileLength = BC.ToUInt32(bin, pos);
        pos += 4;
        if(this.Composed){
            bin = (new Zlib.Inflate(bin, {index:pos})).decompress();
            pos = 0;
        }
        this.FrameSize = new Rect(bin, pos);
        pos += this.FrameSize.Size;
        this.FrameRate = BC.ToInt8(bin, pos++);
        pos++;
        this.FrameCount = BC.ToUInt16(bin, pos);
        pos += 2;
        this.Tag = [];
        while (pos < bin.length) {
            this.Tag.push(new Tag(bin, pos));
            pos += this.Tag[this.Tag.length - 1].Size;
            if(this.Composed) this.Tag[this.Tag.length-1].Position += 8;
            if(this.Tag[this.Tag.length - 1].Type == 0) break;
        }
    });

    function Rect(bin, startIndex) {
        this.NBits = (BC.ToUInt8(bin, startIndex) & 0xf8) >> 3;
        this.Size = Math.floor((this.NBits * 4 + 5) / 8 + 0.9999);
        this.Xmin;
        this.Xmax;
        this.Ymin;
        this.Ymax;
    }

    function Tag(bin, startIndex) {
        var TagCodeAndLength = BC.ToUInt16(bin, startIndex);
        var headerSize = this.Size = 2;
        this.Type = (TagCodeAndLength & 0xffc0) >> 6;
        this.Name = TagName[this.Type];
        this.Position = startIndex;
        this.Length = TagCodeAndLength & 0x3f;
        if (this.Length == 0x3f) {
            this.Size += 4;
            headerSize += 4;
            this.Length = BC.ToUInt32(bin, startIndex + 2);
        }
        this.Size += this.Length;

        switch (this.Type){
            case 35:    //DefineBitsJPEG3
                var imageSize = BC.ToUInt32(bin, startIndex+headerSize+2);
                var imageData = new Uint8Array(imageSize);
                for(var i = 0;i < imageSize;i++){
                    imageData[i] = bin[startIndex+headerSize+6+i];
                }
                URL.createObjectURL(new Blob([imageData], {"type":"image/jpg"}));
                break;
        }
    }

    var TagName = {"0": "End", "1": "ShowFrame", "2": "DefineShape", "3": "FreeCharacter", "4": "PlaceObject", "5": "RemoveObject", "6": "DefineBitsJPEG", "7": "DefineButton", "8": "JPEGTables", "9": "SetBackgroundColor", "10": "DefineFont", "11": "DefineText", "12": "DoAction", "13": "DefineFontInfo", "14": "DefineSound", "15": "StartSound", "15": "StopSound", "17": "DefineButtonSound", "18": "SoundStreamHead", "19": "SoundStreamBlock", "20": "DefineBitsLossless", "21": "DefineBitsJPEG2", "22": "DefineShape2", "23": "DefineButtonCxform", "24": "Protect", "25": "PathsArePostscript", "26": "PlaceObject2", "28": "RemoveObject2", "29": "SyncFrame", "31": "FreeAll", "32": "DefineShape3", "33": "DefineText2", "34": "DefineButton2", "35": "DefineBitsJPEG3", "36": "DefineBitsLossless2", "37": "DefineEditText", "38": "DefineVideo ", "39": "DefineSprite", "40": "NameCharacter", "41": "ProductInfo", "42": "DefineTextFormat ", "43": "FrameLabel", "45": "SoundStreamHead2", "46": "DefineMorphShape", "47": "GenerateFrame", "48": "DefineFont2", "49": "GeneratorCommand", "50": "DefineCommandObject ", "51": "CharacterSet ", "52": "ExternalFont ", "56": "Export", "57": "Import", "58": "EnableDebugger", "59": "DoInitAction", "60": "DefineVideoStream", "61": "VideoFrame", "62": "DefineFontInfo2", "63": "DebugID", "64": "EnableDebugger2", "65": "ScriptLimits", "66": "SetTabIndex", "69": "FileAttributes", "70": "PlaceObject3", "71": "Import2", "72": "DoABCDefine", "73": "DefineFontAlignZones", "74": "CSMTextSettings", "75": "DefineFont3", "76": "SymbolClass", "77": "Metadata", "78": "DefineScalingGrid", "82": "DoABC", "83": "DefineShape4", "84": "DefineMorphShape2", "86": "DefineSceneAndFrameData", "87": "DefineBinaryData", "88": "DefineFontName", "90": "DefineBitsJPEG4"}
})(window);