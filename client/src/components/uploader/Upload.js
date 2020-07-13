import React, { Component } from "react";
import Dropzone from "./Dropzone";
import Progress from "./Progress";
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoIdToken } from 'amazon-cognito-identity-js';
import axios from 'axios';
import jwt_decode from "jwt-decode"
import { stringLiteral } from "@babel/types";
const UserPoolId = 'us-east-1_Nyqobq2qH';
const ClientId = '34524dvl31gse4v09bnejt0499';
const ApiGatewayUrl = 'https://i36ip33cnh.execute-api.us-east-1.amazonaws.com/production/';


const userPool = new CognitoUserPool({
  UserPoolId: UserPoolId,
  ClientId: ClientId,
});


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      accessToken: '',
      isAuthenticated: true,
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {

      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      console.log('onDrop' + file)
      // first get the pre-signed URL

      var decoded = JSON.parse(Buffer.from(localStorage.getItem('token'), 'base64').toString());        
      //console.log(decoded);
      this.state.accessToken = decoded.id_token;


      let data = {
        'name': file.name    
      }
      axios.post(ApiGatewayUrl, data,
          {headers: {Authorization: this.state.accessToken}}).then((response) => {
          // now do a PUT request to the pre-signed URL
          console.log('Presigned URL' + response.data)
          const options = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              console.log(progressEvent.loaded)
              console.log(progressEvent.total)
              if (progressEvent.lengthComputable) {
                  const copy = { ...this.state.uploadProgress };
                  copy[file.name] = {
                    state: "pending",
                    percentage: (progressEvent.loaded / progressEvent.total) * 100
                  };
                  this.setState({ uploadProgress: copy });
                }
            },
          };
        const signed_url = response.data
          axios.put(signed_url, file, options)
              .then((response) => {
                const copy = { ...this.state.uploadProgress };
                 copy[file.name] = { state: "done", percentage: 100 };
                 this.setState({ uploadProgress: copy });
                resolve(response);
              });
      });
    })
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {

    if (this.state.successfullUploaded) {
      return (
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  render() {
    return (
      <div className="Upload">
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}

export default Upload;
