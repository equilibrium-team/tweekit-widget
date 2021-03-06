# :rocket: Introduction

Equilibrium's first decentralized application (dApp) normalizes any filetype (ie. Photoshop to .png or pdf to .jpeg) to fix any upload issues for your customers, eliminating frustration and reducing signup/import issues with your web, app or service instantly.

TweekIT's core technology is based on the industry-leading MediaRich engine by Equilibrium Inc, which is currently powering some of the world's largest B2B portals.

Tweekit takes full advantage of the Tweekit REST API to provide you with an easy to use visual tool to perform image transformations.


# :wrench: Installation

Get it by typing this on your terminal

`npm i tweekit-widget`

or add this script to your html file by downloading the minified version [here](https://github.com/equilibrium-team/tweekt-widget/blob/master/_Output/tweekit/release/tweekit-widget.min.js)

# :running: Getting Started
Once you have an account you will need Register your widget so you can generate a domain specific AppID - this just takes a moment. Click here to start the process, the only information we require is the domain where you are going to host the Widget, and your user account.

To register your Widget you will need to enter the full domain for your site eg: www.yoursitename.com once you have done so, you will be able to generate the App Token and Widget Code. You will then use the Widget code to register your Widget from your site, and the Widget API to control it.

```
<script>
    var tweekit = new Tweekit('#tweekit-box', {
        appId: '{ your app ID }'
    })
</script>
```

# :books: Constructor & Parameters

## :pushpin: Paremeters
| Parameter | Type | Value
| ----------- | ----------- | ----------- |
| selector | string | A CSS selector that matches a single element in the HTML
| options | object | A set of options to configure on your tweekit widget

## :pushpin: Options keys

| Parameter | Type | Value
| ----------- | ----------- | ----------- |
| message | string | A string to display when there is no image to display in the widget.
| headers | object | An object of name-value pair strings to use in widget requests.
| cropOnRender | boolean | Whether or not to display the crop tool after render.
| cropWidth | number | The initial width of the crop tool.
| cropHeight | number | The initial height of the crop tool.
| appId | string | The AppId to validate your tweekit-widget use


### example

```
var options = {
    appId: '{ your app ID }',
    message: 'drop or click to upload image',
    cropWidth: 500,
    cropHeight: 500,
    cropOnRender: true,
    header: {
        'Referrer Policy': 'strict-origin-when-cross-origin'
    }
}

var tweekit = new Tweekit('#canvas0', options})
```

# :pushpin: Properties

| Parameter | Read Type | Type | Description
| ----------- | ----------- | ----------- | ----------- |
| Origin | Read Only | string | The origin portion of the URL used to make all underlying API requests. It will generally be of the form `[protocol]://[servername]:[port].` <br><br>  Default Value: `“https”//www.tweekit.io:443”`
| Path | Read Only | string | The path portion of the URL used for underlying API requests. <br><br> Default Value: `“https”//www.tweekit.io:443”`
| docId | Read Only | number | An identifier for the document currently being displayed by the widget or null if a document has not been uploaded yet.
| currentFile | Read Only | string | The name of the file last uploaded to the widget
| tweeks | Read Only | object | The current crop points, **x1, y1, x2, y2,** and **zoom factor**
| pageCount | Read Only | number | The number of pages in the document last uploaded to the widget
| pageNumber | Read & Write | number | An object of string name/value pairs to send with subsequent requests <br><br> Default Value: 1
| backgroundColor | Read & Write | string | In some cases, like an elliptical crop or if the result dimensions are set larger than the crop dimensions, a background may be visible, use this property to set the color, specified in HTML RGB color notation ‘#ffffff’. <br><br> Default Value: #000000
| elliptical | Read & Write | boolean | Whether or not the crop dimensions specify an elliptical crop as opposed to a rectangular crop. <br><br> Default Value: false
| alpha | Read & Write | boolean | If true apply any alpha channel to the image. <br><br> Default Value: false
| format | Read & Write | string | A format string for the preview image should be one of ‘gif’, ‘jpg’, or ‘png’. <br><br> Default Value: jpg
| resultWidth | Read & Write | number | Width of the final result image.
| resultHeight | Read & Write | number | Height of the final result image.

### example

```

var tweekit = new Tweekit('#tweekit-box')

var the_origin = tweekit.origin
var the_path = tweekit.path

console.log(`processing files to server ${ the_origin } ${ the_path }`)

var the_current_header = tweekit.headers
tweekit.headers = {
    'Referrer Policy': 'strict-origin-when-cross-origin'
}

```


# :hammer: Methods

## getParams( asJson )
gets format and parameters of the preview API call currently displaying an image in the widget.

| Key | Type | Description
| ----------- | ----------- | ----------- |
| asJSON | boolean | Determines if the parameters are formatted as JSON or URL encoded.

***Returns: A string of formatted parameters***


## addEventListener( name, listener )
Behaves much like the standard function of the same name, but accepts custom names for the TweekIt object.

| Key | Type | Description
| ----------- | ----------- | ----------- |
| name | string | Should be one of ***render , update or propertychange***
| listener | function | A function to handle emitted events


## removeEventListener( name, listener )
Behaves much like the standard function of the same name, but accepts custom names for the TweekIt object.

| Key | Type | Description
| ----------- | ----------- | ----------- |
| name | string | Should be one of ***render , update or propertychange***
| listener | function or Event instance | The listener instance to remove


## reset()
Resets the widget to it’s starting state

## result()
Gives you a blob of the tweekit result

## download( filename )
fires a download event with you desired file name

| Key | Type | Description
| ----------- | ----------- | ----------- |
| filename | string | desired filename for your downloaded file

# 🎉 Events

##  render
Fired whenever a server-side render is performed with one of the REST APIs
| Key | Type | Description
| ----------- | ----------- | ----------- |
| image | blob | The image element currently being managed by the widget.
| crimg | node | The cropped image html element.
| width | number | The natural width of the image managed by the widget.
| height | number | The natural height of the image being managed by the widget.
| isUploading | boolean | Whether or not the image is still being uploaded to the widget.

##  update
Fired whenever a client-side change is performed
| Key | Type | Description
| ----------- | ----------- | ----------- |
| points | array | Crop coordinates.
| zoom | number | Scale factor.

##  propertychange
Fired whenever one of the TweekIt objects properties changes
| Key | Type | Description
| ----------- | ----------- | ----------- |
| name | string | Name of the property that changed.
| oldValue | any | Value of property before change.
| newValue | any | Value of the property after a change.



