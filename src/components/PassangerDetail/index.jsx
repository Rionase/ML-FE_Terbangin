const PassangerDetail = ({ index, passangerName, passangerId }) => {
    return (
        <>
            <p className="my-0 mx-1 ps-5">
                Penumpang {index + 1}: {passangerName}
            </p>
            <p className="my-0 mx-1 ps-5">ID: {passangerId}</p>
        </>
    );
};

export default PassangerDetail;
