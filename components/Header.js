import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import PropTypes from 'prop-types';
import logo from '../public/logo.png';

const Header = (props) => {
  const { onOpenArticle } = props,
    posthog = usePostHog(),
    handleLinkClick = (event, articleId) => {
      event.preventDefault();
      onOpenArticle(articleId);

      posthog.capture(
        "navigation_clicked",
        {
          id: articleId
        }
      );
    };

  return (
    <header id="header" style={props.timeout ? { display: 'none' } : {}}>
      <div className="logo">
        <Image alt="logo" src={logo} width='300px' height='300px' />
      </div>
      <div className="content">
        <div className="inner">
          <h1> Twistine :  POST to OPEN🅰️🅿️ℹ️ </h1>
          <p style={{ fontSize: '1.2em' }}>💽.<br /> <br />
            A Proof of Concept.</p> {/* Increased font size */}
        </div>
      </div>
      <nav>
        <ul>
          <li><a href="#" onClick={(event) => { handleLinkClick(event, 'convert'); }}>Convert</a></li>
        </ul>
      </nav>
    </header>
  )
};

Header.propTypes = {
  onOpenArticle: PropTypes.func,
  timeout: PropTypes.bool
}

export default Header;
