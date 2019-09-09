import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { makeStyles } from '@material-ui/core/styles';

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';

function Editor(props) {

    const useStyles = makeStyles(theme => ({
        quill: {
            color: theme.palette.text.primary,
            '& a': {
                color: theme.palette.text.primary,
            },
            '& .ql-toolbar': {
                color: theme.palette.common.black,
                backgroundColor: theme.palette.common.white,
            },
            '& .ql-container': {
                height: props.height,
                color: theme.palette.text.secondary,
                padding: '5px',
                border: '0px',
            },
        },
    }));

    const classes = useStyles();

    return (
        <div id="#quill" className={classes.quill}>
            <ReactQuill
                theme={props.theme}
                onChange={props.onChange}
                value={props.text}
                modules={Editor.modules}
                formats={Editor.formats}
                bounds={'#quill'}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                scrollingContainer={'#quill'}
            />
        </div>
    )
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

export default Editor;
