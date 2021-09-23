import React from 'react';
import './editor.css';

export default class Editor extends React.Component {
    render() {
        return (
            <div class="container">
                <textarea class="text"></textarea>
            </div>
        );
    }
}