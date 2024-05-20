import PropTypes from 'prop-types';
import React from 'react';
import ConvertForm from './ConvertForm';
import CopyButton from './CopyButton';
import SchemaView from './SchemaView';

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      convertedSchema: ''
    }

    this.updateConvertedSchema = this.updateConvertedSchema.bind(this);
  }

  updateConvertedSchema(convertedSchema) {
    console.log('Updating converted schema')
    this.setState({
      convertedSchema
    });
  }

  render() {

    const close = (
      <div className="close" onClick={() => {
        if (this.state.convertedSchema) {
          this.setState({
            convertedSchema: ''
          });
        } else {
          this.props.onCloseArticle()
        }

      }}></div>
    );

    return (
      <div id="main" style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}>

        <article id="convert" className={`${this.props.article === 'convert' ? 'active' : ''} ${this.props.articleTimeout ? 'timeout' : ''}`} style={{ display: 'none' }}>

          {
            this.state.convertedSchema ? (
              <SchemaView schema={this.state.convertedSchema} />
            ) : (
              <>
                <h2 className="major">Convert</h2>
                <ConvertForm updateConvertedSchema={this.updateConvertedSchema} />
              </>
            )
          }
          {this.state.convertedSchema && <CopyButton alertText='OpenAPI schema copied to clipboard!' copyText={this.state.convertedSchema} />}
          {close}
        </article>

      </div>
    )
  }
}

Main.propTypes = {
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool
}

export default Main;
