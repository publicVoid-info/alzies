import React from 'react'
import ReactQuill from 'react-quill'
import PropTypes from 'prop-types'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.core.css'

/* 
 * Simple editor component that takes placeholder text as a prop 
 */
class Editor extends React.Component {    
    
    render() {
        
        return (
            <div>
                <ReactQuill
                    theme={this.props.theme}
                    onChange={this.props.onChange}
                    value={this.props.text}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    bounds={'.app'}
                    placeholder={this.props.placeholder}                    
                    readOnly={this.props.readOnly}
                />
            </div>
        )
    }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

/* 
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string,
}

export default Editor
