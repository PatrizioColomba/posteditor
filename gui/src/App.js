import './App.css';
import Brand from './brand/Brand';
import React from 'react';
import Editor from './editor/Editor';

class App extends React.Component {
  render() {
    const temp = true;
    var element = <Brand />;
    if(temp) {
      element = <Editor />
    }

    return (
      <section>
        {element}
      </section>
    );
  }
}

export default App;
