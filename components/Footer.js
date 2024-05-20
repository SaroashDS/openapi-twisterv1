import PropTypes from 'prop-types';

const Footer = (props) => (
    <footer id="footer" style={props.timeout ? {display: 'none'} : {}}>
        <p className="info">
            Postman to OpenAPI Converter | By Abacus Cloud and AI Team.
        </p>
    </footer>
)

Footer.propTypes = {
    timeout: PropTypes.bool
}

export default Footer;
