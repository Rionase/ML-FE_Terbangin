import algoliasearch from "algoliasearch/lite";
import {
    InstantSearch,
    connectSearchBox,
    connectHits,
    connectStateResults,
    connectHighlight,
} from "react-instantsearch-dom";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { TextField, Button } from "@mui/material";
import "./airport.css";

const searchClient = algoliasearch(
    import.meta.env.VITE_ALGOLIA_APP_ID,
    import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
);

const StartCustomHighlight = connectHighlight(
    ({ highlight, attribute, hit, highlightProperty = "_highlightResult" }) => {
        const parsedAttribute = attribute.split(".");
        let parsedHit = hit;
        for (let i = 0; i < parsedAttribute.length; i++) {
            parsedHit = parsedHit[parsedAttribute[i]];
        }

        const highlights = highlight({
            highlightProperty: highlightProperty,
            attribute: parsedAttribute.join("."),
            hit: hit,
        });

        return (
            <>
                {highlights.map((part, index) =>
                    part.isHighlighted ? (
                        <mark key={index}>{part.value}</mark>
                    ) : (
                        <span key={index}>{part.value}</span>
                    )
                )}
            </>
        );
    }
);

const ResultsWrapper = connectStateResults(
    ({ searchState, searchResults, children }) => {
        const queryLength =
            searchState && searchState.query ? searchState.query.length : 0;
        return searchResults && searchResults.nbHits !== 0 && queryLength > 0
            ? children
            : null;
    }
);

const StartCustomHits = connectHits(
    ({ hits, setStartAirport, setIataCodeDeparture, setLgShowDeparture }) => {
        return hits.length > 0 ? (
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "white",
                    zIndex: 1,
                    width: "100%",
                }}
            >
                {hits.slice(0, 5).map((hit, index) => (
                    <Button
                        key={hit.objectID}
                        onClick={() => {
                            setStartAirport(hit.dataValues.city);
                            setIataCodeDeparture(hit.dataValues.iataCode);
                            setLgShowDeparture(false);
                        }}
                        style={{
                            width: "100%",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    color: "#333",
                                    fontWeight: "bold",
                                }}
                            >
                                <StartCustomHighlight
                                    attribute="dataValues.city"
                                    hit={hit}
                                />
                                , &nbsp;
                                <StartCustomHighlight
                                    attribute="dataValues.country"
                                    hit={hit}
                                />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <StartCustomHighlight
                                    attribute="dataValues.name"
                                    hit={hit}
                                />
                            </div>
                        </div>
                    </Button>
                ))}
            </div>
        ) : null;
    }
);
const StartCustomSearchBox = connectSearchBox(
    ({ currentRefinement, refine }) => {
        const debouncedRefine = debounce(refine, 10, { maxWait: 100 });

        const handleKeyDown = (event) => {
            if (
                event.key === "Escape" ||
                event.key === "Esc" ||
                event.key === "Delete"
            ) {
                debouncedRefine("");
            }
        };

        return (
            <TextField
                autoComplete="off"
                variant="standard"
                type="search"
                value={currentRefinement}
                onChange={(event) => debouncedRefine(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                style={{ width: "100%", fontWeight: "bold" }}
                InputProps={{ style: { fontWeight: "bold" } }}
                placeholder="Search for an airport..."
            />
        );
    }
);

const StartAirportSearchComponent = ({
    setStartAirport,
    setIataCodeDeparture,
    setLgShowDeparture,
}) => {
    return (
        <InstantSearch indexName="airports" searchClient={searchClient}>
            <div style={{ position: "relative" }}>
                <StartCustomSearchBox />
                <ResultsWrapper>
                    <StartCustomHits
                        setStartAirport={setStartAirport}
                        setIataCodeDeparture={setIataCodeDeparture}
                        setLgShowDeparture={setLgShowDeparture}
                    />
                </ResultsWrapper>
            </div>
        </InstantSearch>
    );
};

StartAirportSearchComponent.propTypes = {
    setStartAirport: PropTypes.func,
    setIataCodeDeparture: PropTypes.func,
    setLgShowDeparture: PropTypes.func,
};

StartCustomSearchBox.propTypes = {
    currentRefinement: PropTypes.string,
    refine: PropTypes.func,
    setRefine: PropTypes.func,
};

StartCustomHighlight.propTypes = {
    attribute: PropTypes.string.isRequired,
    hit: PropTypes.object.isRequired,
};

export default StartAirportSearchComponent;
