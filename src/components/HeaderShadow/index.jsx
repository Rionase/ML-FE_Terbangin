import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
const HeaderShadow = ({ children }) => {
  return (
    <div
      className="pb-2"
      style={{
        boxShadow: " 1px 0 10px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container>{children}</Container>
    </div>
  );
};

HeaderShadow.propTypes = {
  text: PropTypes.string,
};

export default HeaderShadow;
