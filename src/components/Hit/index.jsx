import { Highlight } from "react-instantsearch";
import PropTypes from "prop-types";
// Remove the unused import statement

export const Hit = ({ hit }) => {
  return (
    <article style={{ textAlign: "left" }}>
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-city">
        <Highlight attribute="city" hit={hit} />
      </div>
    </article>
  );
};

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};
