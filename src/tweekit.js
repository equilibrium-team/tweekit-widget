import {version} from '../package.json';
import css from '../tweekit.css';
import '../node_modules/croppie/croppie.css'
const Croppie = require('croppie');
import { Base64 } from 'js-base64';

import { PREVIEWABLE_FORMATS, DEFAULT_OPTIONS } from './constants.js';



export default class TweekIt {
    constructor(selector, options) {
        this._version = version;
        this._selector = selector;
        this._currFile = null;
        this._container = null;
        this._options =  { ...DEFAULT_OPTIONS, ...options };
        this._message = 'TweekIt!';
        this._headers = {};
        this._protocol = GLBL_PROTOCOL;
        this._host = GLBL_APIURL;
        this._port = GLBL_PORT;
	this._endpoint = 'preview';
        this._origin = `${this._protocol}://${this._host}:${this._port}`;
        this._counter = 0;
        this._tweeker = null;
        this._pageCount = 0;
        this._pageNumber = 1;
        this._onloadHandlers = [];
        this._backgroundColor = "0x000000";
        this._resultWidth = -1;
        this._resultHeight = -1;
        this._alpha = false;
        this._format = 'jpg';
        this._docId = '00000000000000000000000000000000';
	this._docIdBuf = null;
        this._tweekerOptions = {
            enableResize: true,
            enforceBoundary: true,
            viewport: {
                type: 'square'
            }
        };

        // Stable Diffusion
        this._useSD = false;
        this._textPrompt = "";
	    this._strength = 0.7;
	    this._sdCoors = [];

        this._container = document.querySelector(this._selector);
        this._container.classList.add('tweekit-container');

        if(this._options["message"]) {
            this._message = options.message;
        }
        this._setMessage(this._message);

        if(this._options['headers']) {
            this._headers = this._options.headers;
        }

        if(this._options['appId']) {
            let appId = JSON.parse(Base64.decode(this._options.appId));
            this._headers.ApiKey = appId.ApiKey;
            this._headers.ApiSecret = appId.ApiSecret;
        }

        this._container.addEventListener("click",(e) => {
            if (!this._currFile) {

                const uploadBtn = document.createElement('input')
                uploadBtn.classList.add('hide')
                uploadBtn.setAttribute('type','file')
                uploadBtn.addEventListener('change', (e) => {
                    const files =  uploadBtn.files
                    const event = new CustomEvent('render', { detail: { isUploading: true } });
                    this._container.dispatchEvent(event);

                    this._handleFileUpload(files);

                    uploadBtn.remove()
                })

                const bodyEL = document.querySelector('body')

                document.querySelector('body').appendChild(uploadBtn)
                uploadBtn.click()
            }
       })

       this._container.addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.classList.add('tweekit--drag-enter');
            this.style.border = "2px solid red";
        });

        this._container.addEventListener("dragleave", function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.classList.remove('tweekit--drag-enter');
            this.classList.add('tweekit--drag-leave');
            this.style.border = '1px solid black';
        });

        this._container.addEventListener('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        this._container.addEventListener("drop", (e) => {
            e.stopPropagation();
            e.preventDefault();
            this._container.classList.remove('tweekit--drag-enter')
            try {
                var files = e.dataTransfer.files;
                this._handleFileUpload(files);
            }
            catch(err) {
                this._handleError(err)
            }
        });
    }

    get version() {
        return this._version
    }

    get currentFile() {
        return { ...this._currFile }
    }

    get path() {
         return `/tweekit/api/image/preview/${this._docId}`;
    }

    get endpoint() {
	return this._endpoint;
    }

    set endpoint(np) {
	this._endpoint = np;
    }

    get docId() {
        return this._docId;
    }

    set docId(di) {
        this._docId = di;
    }

    get docIdBuf() {
        return this._docIdBuf;
    }

    set docIdBuf(di) {
        this._docIdBuf = di;
    }

    get tweeks() {
        let r = {};
        if(this._tweeker != null) {
            r = this._tweeker.get();
        }
        return r;
    }

    set sdCoors(c){
	this._sdCoors = c;
    }

    get sdCoors(){
	return this._sdCoors;
    }

    get pageCount() {
        return this._pageCount;
    }

    get origin() {
        return this._origin;
    }

    set origin(origin) {
        let oldVal = this._origin;
        this._origin = origin;
        this._dispatchPropertyChange('origin', oldVal, origin);
    }

    get useSD() {
        return this._useSD;
    }

    set useSD(us) {
        this._useSD = us;
    }

    get textPrompt() {
        return this._textPrompt;
    }

    set textPrompt(p) {
        this._textPrompt = p;
    }

    get strength() {
    	return this._strength;
    }
    
    set strength(st) {
    	this._strength = st;
    }

    get headers() {
        return this._headers;
    }

    set headers(headers) {
        let oldVal = this._headers;
        this._headers = headers;
        this._dispatchPropertyChange('headers', oldVal, headers);
    }

    get pageNumber() {
        return this._pageNumber;
    }

    set pageNumber(pageNumber) {
        let oldVal = this._pageNumber;
        this._pageNumber = pageNumber;

        //fixme:mftb needs further refactor
        let nc = Math.random();
        let bg = this._backgroundColor;
        let params = `?bg=${bg}&page=${pageNumber}&fmt=jpg&alpha=false&_=${nc}`;
        let url = `${this._origin}${this.path}${params}`;

        if (this._docId) {
            this._setPreviewUrl(url);
            this._dispatchPropertyChange('pageNumber', oldVal, pageNumber);
        }
    }

    get backgroundColor() {
        return this._backgroundColor.replace("0x", "#");
    }

    set backgroundColor(backgroundColor) {
        let oldVal = this._backgroundColor;
        this._backgroundColor = backgroundColor.replace("#", "0x");
        this._dispatchPropertyChange('backgroundColor', oldVal, backgroundColor);
    }

    get elliptical() {
        return this._tweekerOptions.viewport.type == "circle";
    }

    set elliptical(elliptical) {
        let oldVal = null;
        if(this._tweeker) {
            oldVal = (this._tweeker.elements.viewport.type == 'circle');
            if(elliptical) {
                this._tweekerOptions.viewport.type = "circle";
                this._tweeker.elements.viewport.classList.remove("cr-vp-square");
                this._tweeker.elements.viewport.classList.add("cr-vp-circle");
            }
            else {
                this._tweekerOptions.viewport.type = "square";
                this._tweeker.elements.viewport.classList.remove("cr-vp-circle");
                this._tweeker.elements.viewport.classList.add("cr-vp-square");
            }
        }
        else {
            oldVal = this._tweekerOptions.viewport.type;
            if(elliptical) {
                this._tweekerOptions.viewport.type = "circle"
            }
            else {
                this._tweekerOptions.viewport.type = "square"
            }
        }
        this._dispatchPropertyChange('elliptical', oldVal, elliptical);
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(enable) {
        let oldVal = this._alpha;
        this._alpha = enable;
        this._dispatchPropertyChange('alpha', oldVal, enable);
    }

    get format() {
        return this._format;
    }

    set format(format) {
        let oldVal = this._format;
        this._format = format;
        this._dispatchPropertyChange('format', oldVal, format);
    }

    get resultWidth() {
        return this._resultWidth;
    }

    set resultWidth(width) {
        let oldVal = this._resultWidth;
        this._resultWidth = width;
        this._dispatchPropertyChange('resultWidth', oldVal, width);
    }

    get resultHeight() {
        return this._resultHeight;
    }

    set resultHeight(height) {
        let oldVal = this._resultHeight;
        this._resultHeight = height;
        this._dispatchPropertyChange('resultHeight', oldVal, height);
    }

    getParams(asJSON, hasCrop = true, isPreview = false) {


        let buf = "";

        if(this._tweeker != null) {
            let params = {};

            if (isPreview) {
                if (PREVIEWABLE_FORMATS.includes(this._format)) {
                    // if the current format on tweekit is previewable
                    // just use the same format that was registered in
                    // tweekit
                    params.fmt = this._format

                } else {
                    // use this if ever you are using other formats
                    // that don't support web previews
                    params.fmt = "jpg"
                }
            } else {
                params.fmt = this._format
            }

            // Stable Diffusion
            params.useSD = this._useSD;
            params.textPrompt = this._textPrompt;
	        params.textStrength = this._strength;

            params.alpha = this._alpha;
            params.page = this._pageNumber;

            if (hasCrop) {
                let d = this.tweeks;
		let c = this._sdCoors;
                let z = d.zoom;
                params.elliptical = this.elliptical;
	    	if(c[0] != undefined){
		    params.x1 = Math.floor(c[0]);
		    params.y1 = Math.floor(c[1]);
		    params.x2 = Math.floor(c[2]);
		    params.y2 = Math.floor(c[3]);
		}
		else{
                    params.x1 = Math.floor((d.points[0]));
                    params.y1 = Math.floor((d.points[1]));
                    params.x2 = Math.floor((d.points[2]));
                    params.y2 = Math.floor((d.points[3]));
		}
            }

            // params.width = Math.floor((d.points[2] - d.points[0])*z);
            // params.height = Math.floor((d.points[3] - d.points[1])*z);
            if(this._resultWidth > -1) params.width = this._resultWidth;
            if(this._resultHeight > -1) params.height = this._resultHeight;
            params.bg = this._backgroundColor;
            // params._ = this._counter;

            //fixme: find out if we still need the counter
            if(asJSON) {
                buf = JSON.stringify(params);
            }
            else {
                for(let param in params) {
                    buf += "&" + param + "=" + params[param];
                }
                buf = buf.substring(1);
            }
        }
        return buf;
    }

    // eventName should generally one of render|update|propertychange but
    // we add it whatever it is
    addEventListener(eventName, listener) {
        if(eventName == "update") {
            if(this._tweeker) {
                this._container.addEventListener(eventName, listener);
            }
        }
        else {
            this._container.addEventListener(eventName, listener);
        }
    }

    // eventName should generally one of render|update|propertychange but
    // we add it whatever it is
    removeEventListener(eventName, listener) {
        this._container.removeEventListener(eventName, listener);
    }

    reset(callback = null) {
        if (this._tweeker) {
            this._tweeker.destroy()
            this._tweeker = null
            this._currFile = null
        }

        if (callback) {
            callback()
        }

        this._setMessage(this._options.message)
    }

    async result(isDownload = true, hasCrop = true) {
        const isPreview = !isDownload
        const urlParams = this.getParams(false, hasCrop, isPreview)

        let url = `${this._origin}${this.path}?${urlParams}`;

        if (isDownload) {
            url = url.replace("preview/", "")
        }

        const data = await this._doReq(url)
            .then(response => response.blob())
        return data
    }

    async preview(){
        let url = `${this._origin}${this.path}`;
        const data = await this._doReq(url)
            .then(response => {
		let r = response;
		return [r.blob(), r.headers.get('x-cpucoinminer-imageheight'), r.headers.get('x-cpucoinminer-imagewidth')]
		response.blob()
	    })
        return data
    }

    async generate() {
        const reqParams = this.getParams(true, false, false)

        // let url = `${this._origin}/tweekit/api/image/generate${this._docId}?${urlParams}`;
        let url = `${this._origin}/tweekit/api/image/generate/${this._docId}`;

        // Append request parameters to form data (Th.)
        let fd = {
                "textPrompt": this._textPrompt,
                "textStrength": this._strength
            };
        // Run a preview call on the resulting docID (Th.)
        const data = await this._doReqGen(url, fd)
            .then(response => response.json())
        return data
    }

    /*async downloadFromPreview(filename, hasCrop = true, callback = null) {
	// TODO: Rewrite code to download the preview window blob instead of just running the previous request a second time

        // const file = await this.result(true, hasCrop)
        const file = document.getElementById("imageBlob").src;
        let el = document.createElement("a");
        // el.setAttribute('href', URL.createObjectURL(file))
        el.setAttribute('href', file);
        el.setAttribute('download', `${filename}.${this.format}`);
        el.click();

        this.reset(callback)
    }*/
    async download(filename, hasCrop = true, callback = null) {
        const file = await this.result(true, hasCrop)
        let el = document.createElement("a");
        el.setAttribute('href', URL.createObjectURL(file))
        el.setAttribute('download', `${filename}.${this.format}`)
        el.click();

        this.reset(callback)
    }

    _setMessage(message) {

        if (typeof message === 'string') {
            this._container.innerHTML = message;
        }

        if ( typeof message === 'function' ) {
            this._container.innerHTML = message()
        }
    }


    _dispatchPropertyChange(name, oldVal, newVal) {
        let detail = {name: name, oldValue: oldVal, newValue: newVal};
        let event = new CustomEvent('propertychange', {detail: detail});
        this._container.dispatchEvent(event);
    }

    _getPreviewUrl() {
        let buf = null;
        if(this._tweeker != null) {
            buf = this._origin +
            this.path +
            '?' +
            this.getParams();
        }
        return buf;
    }

    _setPreviewUrl(url) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "blob";
        for(let headerName in this._headers) {
            req.setRequestHeader(headerName, this._headers[headerName]);
        }
        let self = this;
        req.onload = async function () {
            if (req.status >= 200 && req.status <= 210) {
                self._setMessage("");

                self._container.style.border = "1px solid black";
                self._container.style.animation = "none";

                let pc = req.getResponseHeader('X-CPUCoinMiner-PageCount');
                self._pageCount = (pc != null) ? pc : 1;
                if(self._tweeker)  {
                        let b = document.querySelector(`${self._selector} .cr-boundary`);
                        if(b) b.removeChild();
                        self._container.classList.remove("croppie-container");
                }

                if (self._options.cropOnRender) {
                    self._tweekerOptions.viewport = {
                        ...self._tweekerOptions.viewport,
                        width: self._options.cropWidth ,
                        height: self._options.cropHeight
                    }
                }

                self._tweeker = new Croppie(self._container, self._tweekerOptions);


                const reqImgUrl = URL.createObjectURL(req.response)


                await self._tweeker
                    .bind({ url: reqImgUrl })
                    .then(() => {
                        let crimg = document.querySelector(`${self._selector} .cr-image`);
                        const detail = {
                            crimg: crimg,
                            width: crimg.naturalWidth,
                            height: crimg.naturalHeight,
                            uploading: false
                        }
                        const event = new CustomEvent('render', { detail });
                        self._container.dispatchEvent(event);
                    })
                    .catch((err) => {
                        console.error('Tweekit error: ', err)
                    })
            }
        };
        req.send();
    }

    _doReq(u) {
        return fetch(u, {
            cache: "no-cache",
            credentials: "same-origin",
            headers: new Headers(this._headers)
        });
    }

    _doReqGen(u, formData) {
        // this._headers add Content-type to "application/json;charset=UTF-8"
        let h = {...this._headers};
        h['Content-Type'] = "application/json"
        return fetch(u, {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: h,
                body: JSON.stringify(formData)
            });
    }

    async _sendFileToServer(formData, status) {
        let endpt = '/tweekit/api/image/upload';
        var uploadURL = `${this._origin}${endpt}`;
        let resp = await fetch(uploadURL, {
            method: "POST",
            headers: new Headers(this._headers),
            cache: "no-cache",
            credentials: "same-origin",
            body: formData
        });

        let data = null

        try {
            data = await resp.json();
            if ( data.status && data.status === 500 ) {
                this._handleError({ ...data })
                throw ({ ...data })
            }
        } catch(err) {
            this._handleError(err)
            throw err
        }

        this._docId = data.docId;
        let prevPath = this.path;
        let nc = `_=${Math.random()}`;
        let prevParams = `?fmt=jpg&alpha=false&${nc}`;
        let url = `${this._origin}${prevPath}${prevParams}`;
        this._setPreviewUrl(url);
    }

    async _checkFilename(filename) {
        return new Promise(async (resolve, reject)=>{
            let ext = filename.substring(filename.lastIndexOf('.'));
            let endpt = '/tweekit/api/image/doctype';
            let params = `extension=${ext}`;
            let u = `${this._origin}${endpt}?${params}`;

            // let resp = null
            let data = null

            data = await this._doReq(u)
                .then(response => {
                    const jsonResponse = response.json()
                    return jsonResponse
                })
                .catch( err => {
                    reject(err)
                })


            if (data) {
                const isError =
                    data.docType && data.docType.includes('MediaRich Server Error') ||
                    !data.docType ||
                    data.docType.length === 0

                if (isError) {
                    let errmsg = ""
                    if (data.extensions.length > 1) {
                        errmsg = `The filetypes uploaded are not supported `
                    } else {
                        errmsg = `The filetype " ${data.extensions[0]} " is not supported `
                    }
                    this._handleError(errmsg)
                } else {
                    this._currFile = {
                        ...this._currFile ,
                        filename ,
                        ...data
                    };
                    resolve(true)
                }
            }
        });
    }

    upload(file) {
        this._handleFileUpload([file])
    }

    async _handleFileUpload(files) {
        var fd = new FormData();
        let file = files[0];

        try {
            let fnOk = await this._checkFilename(file.name);
            if(fnOk) {
                fd.append('name', file.name);
                fd.append('file', file);
                this._currFile = { ...this._currFile, file }
                this._sendFileToServer(fd, status);
            }
            else {
                this._handleError('File nogo')
                this._container.style.border = "1px solid black";
                this._container.style.animation = "none";
            }
        } catch(err) {
            this._handleError(err)
        }
    }

    _handleError(err) {
        console.error('Tweekit error: ', err)
        const detail = {
            error: err
        }
        const event = new CustomEvent('render', { detail });

        this._setMessage(err);
        this._container.dispatchEvent(event);
    }
}

