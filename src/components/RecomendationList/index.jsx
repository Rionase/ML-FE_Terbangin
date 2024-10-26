import {
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import PropTypes from "prop-types";

const RecommendationList = ({ onSelect }) => {
    const recommendations = [
        { city: "Jakarta", country: "Indonesia", iataCode: "CGK" },
        { city: "Tokyo", country: "Japan", iataCode: "HND" },
        { city: "Seoul", country: "South Korea", iataCode: "ICN" },
        { city: "Beijing", country: "China", iataCode: "PEK" },
        { city: "Dubai", country: "United Arab Emirates", iataCode: "DXB" },
        { city: "Singapore", country: "Singapore", iataCode: "SIN" },
    ];

    return (
        <>
            <List>
                <ListSubheader style={{ zIndex: 0 }}>
                    Popular Destinations
                </ListSubheader>
                {recommendations.map((item, index) => (
                    <ListItemButton key={index} onClick={() => onSelect(item)}>
                        <ListItemText
                            secondary={`○ ${item.city}, ${item.country}`}
                        />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};

RecommendationList.propTypes = {
    onSelect: PropTypes.func,
};

export default RecommendationList;
