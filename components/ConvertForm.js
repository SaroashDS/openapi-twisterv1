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

  const handleFormSubmit = (event) => {
    try {
      event.preventDefault(); // don't redirect the page

      const collectionFile = event.target['collection-file'].files,
        collectionUrl = event.target['collection-url'].value;

      if (collectionFile.length > 0) {
        // User uploaded a file, parse from it
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const text = postmanToOpenApi(e.target.result)
            updateConvertedSchema(text);
          } catch (err) {
            toast.error(<div>{PARSING_ERROR}<br /><br />{err.message}</div>);
            Sentry.captureException(err);
          }

        };
        reader.readAsText(collectionFile[0])

        posthog.capture(
          'collection_converted',
          {
            type: 'file_upload'
          }
        );

      } else if (collectionUrl.length > 0) {
        // User added a URL, fetch from it
        setFetchingCollection(true);

        fetch(collectionUrl)
          .then((res) => res.json())
          .then((collectionData) => {
            try {
              const openApiSchema = postmanToOpenApi(collectionData)
              updateConvertedSchema(openApiSchema);
            } catch (err) {
              toast.error(<div>{PARSING_ERROR}<br /><br />{err.message}</div>);
              Sentry.captureException(err);
            } finally {
              setFetchingCollection(false);
            }

          })
          .catch(((err) => {
            setFetchingCollection(false);

            toast.error(INVALID_URL);
            Sentry.captureException(err);
          }))

        posthog.capture('collection_converted',
          {
            type: 'url'
          }
        );

      } else {
        toast.error(EMPTY_FORM_SUBMIT);

        posthog.capture(
          'empty_convert_clicked',
          {}
        );
      }
    } catch (err) {
      setFetchingCollection(false);

      toast.error(GENERAL_ERROR);
      Sentry.captureException(err);
    }
  };

  if (fetchingCollection) {
    return <Loader text='Fetching collection' />
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className='field'>
          <label htmlFor='collection-url'>Collection URL</label>
          <input type='url' name='collection-url' id='collection-url' placeholder='https://www.postman.com/collections/<COLLECTION-ID>' />
        </div>

        <br />
        <HorizontalLineText text='OR' />
        <br />

        <div className='field'>
          <label htmlFor='collection-file'>Collection File</label>
          <input type='file' name='collection-file' id='collection-file' accept='.json,application/json' />
        </div>

        <ul className='actions'>
          <li><input type='submit' value='Submit' className='special' /></li>
          <li><input type="reset" value="Reset" /></li>
        </ul>
      </form>
    </>
  );
}

export default ConvertForm
