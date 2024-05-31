import * as Sentry from "@sentry/nextjs";
import { usePostHog } from 'posthog-js/react';
import postmanToOpenApi from 'postman-to-openapi-module';
import { useState } from 'react';
import { toast } from 'react-toastify';
import HorizontalLineText from './HorizontalLineText';
import Loader from './Loader';

const JSON_FILE_ERROR = 'Unable to parse uploaded collection JSON. Please check the uploaded file',
  EMPTY_FORM_SUBMIT = 'Either enter a collection URL or upload collection JSON.',
  GENERAL_ERROR = 'Unable to parse collection data. Please try again.',
  PARSING_ERROR = "Following error occurred while parsing the collection.",
  INVALID_URL = 'Unable to fetch collection data. Please check the url';

function ConvertForm(props) {
  const [fetchingCollection, setFetchingCollection] = useState(false),
    updateConvertedSchema = props.updateConvertedSchema,
    posthog = usePostHog();

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // don't redirect the page

    const collectionFiles = event.target['collection-file'].files;

    if (collectionFiles.length > 0) {
      try {
        setFetchingCollection(true);

        const convertedFiles = [];

        for (let i = 0; i < collectionFiles.length; i++) {
          const file = collectionFiles[i];
          const reader = new FileReader();

          reader.onload = async (e) => {
            try {
              const text = await postmanToOpenApi(e.target.result);
              const blob = new Blob([text], { type: 'application/x-yaml' });
              const url = URL.createObjectURL(blob);
              convertedFiles.push({ name: file.name.replace('.json', '.yaml'), url });

              if (convertedFiles.length === collectionFiles.length) {
                setFetchingCollection(false);
                //updateConvertedSchema(convertedFiles);
                downloadFiles(convertedFiles);
              }
            } catch (err) {
              toast.error(<div>{PARSING_ERROR}<br /><br />{err.message}</div>);
              Sentry.captureException(err);
              setFetchingCollection(false);
            }
          };

          reader.readAsText(file);
        }

        posthog.capture('collection_converted', { type: 'file_upload' });
      } catch (err) {
        setFetchingCollection(false);
        toast.error(GENERAL_ERROR);
        Sentry.captureException(err);
      }
    } else {
      toast.error(EMPTY_FORM_SUBMIT);
      posthog.capture('empty_convert_clicked', {});
    }
  };

  const downloadFiles = (files) => {
    files.forEach(file => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (fetchingCollection) {
    return <Loader text='Fetching collection' />
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className='field'>
          <label htmlFor='collection-file'>Collection Files</label>
          <input type='file' name='collection-file' id='collection-file' accept='.json,application/json' multiple />
        </div>

        <ul className='actions'>
          <li><input type='submit' value='Submit' className='special' /></li>
          <li><input type="reset" value="Reset" /></li>
        </ul>
      </form>
    </>
  );
}

export default ConvertForm;
