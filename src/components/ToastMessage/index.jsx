const CustomToastMessage = ({ message, highlight }) => {
    return (
        <div>
            <p>
                {message}{" "}
                <span style={{ color: "#7126b5", fontWeight: "bold" }}>
                    {highlight}
                </span>
            </p>
        </div>
    );
};

export default CustomToastMessage;
