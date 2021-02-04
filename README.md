# :rocket: Introduction

**TweekIT** is a simple yet powerful developer-focused file transformation tool.

TweekIT's core technology is based on the industry-leading MediaRich engine by Equilibrium Inc, which is currently powering some of the world's largest B2B portals.

Tweekit takes full advantage of the Tweekit REST API to provide you with an easy to use visual tool to perform image transformations.


# :wrench: Installation

Get it by typing this on your terminal

`npm i tweekit-widget`


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

var the_docId = tweekit.docId

var the_the_docId = tweekit.currentFile

var the_tweeks = tweekit.tweeks

var the_pageCount = tweekit.pageCount

var the_current_header = tweekit.headers
tweekit.headers = {
    'Referrer Policy': 'strict-origin-when-cross-origin'
}

var the_pageNumber = tweekit.pageNumber
tweekit.pageNumber = the_pageNumber + 1 // go to next page

var the_backgroundColor = tweekit.backgroundColor
tweekit.backgroundColor = '#FF0000'

var the_alpha = tweekit.alpha
tweekit.alpha = false

var the_format = tweekit.format
tweekit.format = "pdf"

var the_resultWidth = tweekit.resultWidth
tweekit.resultWidth = 500

var the_resultHeight = tweekit.resultHeight
tweekit.resultHeight = 900

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



