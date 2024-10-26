import { Form } from "react-bootstrap";
import {
    TextField,
    FormControl,
    FormHelperText,
    FormLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import countriesJSON from "../../data/countries.json";

const PassangerForm = ({
    isSaved,
    handleSwitchChanges,
    handleInputChange,
    passanger,
    errors,
}) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        setCountries(countriesJSON);
    }, []);

    return (
        <Form className="mb-4" key={`${passanger.type}-${passanger.index}`}>
            <div
                style={{
                    backgroundColor: "#343a40",
                    padding: "10px",
                    color: "white",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
            >
                <h6
                    className="mb-0"
                    style={{
                        marginLeft: "4px",
                    }}
                >
                    Data Diri Penumpang {passanger.order} -{" "}
                    {passanger.type.charAt(0).toUpperCase() +
                        passanger.type.slice(1)}
                </h6>
            </div>
            <div style={{ padding: "10px" }}>
                <Form.Group>
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                            paddingTop: "8px",
                        }}
                    >
                        Title
                    </Form.Label>
                    <Form.Control
                        as="select"
                        readOnly={isSaved}
                        value={passanger.title}
                        onChange={(e) =>
                            handleInputChange(
                                passanger.type,
                                passanger.index,
                                "title",
                                e.target.value
                            )
                        }
                        isInvalid={
                            !!errors[
                                `${passanger.type}-${passanger.index}-title`
                            ]
                        }
                    >
                        <option value="">Select Title</option>
                        <option value="MR">Mr.</option>
                        <option value="MRS">Mrs.</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors[`${passanger.type}-${passanger.index}-title`]}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        Nama Lengkap
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Harry"
                        readOnly={isSaved}
                        value={passanger.fullName}
                        onChange={(e) =>
                            handleInputChange(
                                passanger.type,
                                passanger.index,
                                "fullName",
                                e.target.value
                            )
                        }
                        isInvalid={
                            !!errors[
                                `${passanger.type}-${passanger.index}-fullName`
                            ]
                        }
                    />
                    <Form.Control.Feedback type="invalid">
                        {
                            errors[
                                `${passanger.type}-${passanger.index}-fullName`
                            ]
                        }
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-2 d-flex align-items-center">
                    <Form.Label className="mb-0 me-auto">
                        Punya Nama Keluarga?
                    </Form.Label>
                    <Form.Check
                        type="switch"
                        checked={passanger.showFamilyDataPassenger}
                        onChange={() =>
                            handleSwitchChanges(passanger.type, passanger.index)
                        }
                    />
                </Form.Group>

                {passanger.showFamilyDataPassanger && (
                    <Form.Group className="mt-3">
                        <Form.Label
                            style={{
                                color: "#7126B5",
                                fontWeight: "bold",
                            }}
                        >
                            Nama Keluarga
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Potter"
                            readOnly={isSaved}
                            value={passanger.familyName}
                            onChange={(e) =>
                                handleInputChange(
                                    passanger.type,
                                    passanger.index,
                                    "familyName",
                                    e.target.value
                                )
                            }
                            isInvalid={
                                !!errors[
                                    `${passanger.type}-${passanger.index}-familyName`
                                ]
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                errors[
                                    `${passanger.type}-${passanger.index}-familyName`
                                ]
                            }
                        </Form.Control.Feedback>
                    </Form.Group>
                )}
                <Form.Group className="mt-3 position-relative">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        Tanggal Lahir
                    </Form.Label>
                    <div
                        style={{
                            position: "relative",
                            alignItems: "center",
                        }}
                    >
                        <Form.Control
                            id="dateOfBirth1"
                            type="date"
                            style={{
                                width: "100%",
                            }}
                            readOnly={isSaved}
                            value={passanger.dateOfBirth}
                            onChange={(e) =>
                                handleInputChange(
                                    passanger.type,
                                    passanger.index,
                                    "dateOfBirth",
                                    e.target.value
                                )
                            }
                            isInvalid={
                                !!errors[
                                    `${passanger.type}-${passanger.index}-dateOfBirth`
                                ]
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                errors[
                                    `${passanger.type}-${passanger.index}-dateOfBirth`
                                ]
                            }
                        </Form.Control.Feedback>
                    </div>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        Kewarganegaraan
                    </Form.Label>
                    <Form.Control
                        as="select"
                        readOnly={isSaved}
                        value={passanger.nationality}
                        onChange={(e) =>
                            handleInputChange(
                                passanger.type,
                                passanger.index,
                                "nationality",
                                e.target.value
                            )
                        }
                        isInvalid={
                            !!errors[
                                `${passanger.type}-${passanger.index}-nationality`
                            ]
                        }
                    >
                        <option value="">Pilih Kewarganegaraan</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {
                            errors[
                                `${passanger.type}-${passanger.index}-nationality`
                            ]
                        }
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        KTP/Passport
                    </Form.Label>
                    <Form.Control
                        type="text"
                        inputMode="numeric"
                        readOnly={isSaved}
                        value={passanger.idNumber}
                        onChange={(e) =>
                            handleInputChange(
                                passanger.type,
                                passanger.index,
                                "idNumber",
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        isInvalid={
                            !!errors[
                                `${passanger.type}-${passanger.index}-idNumber`
                            ]
                        }
                    />

                    <Form.Control.Feedback type="invalid">
                        {
                            errors[
                                `${passanger.type}-${passanger.index}-idNumber`
                            ]
                        }
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        Negara Penerbit
                    </Form.Label>
                    <Form.Control
                        as="select"
                        readOnly={isSaved}
                        value={passanger.issuingCountry}
                        onChange={(e) =>
                            handleInputChange(
                                passanger.type,
                                passanger.index,
                                "issuingCountry",
                                e.target.value
                            )
                        }
                        isInvalid={
                            !!errors[
                                `${passanger.type}-${passanger.index}-issuingCountry`
                            ]
                        }
                    >
                        <option value="">Pilih Negara Penerbit</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {
                            errors[
                                `${passanger.type}-${passanger.index}-issuingCountry`
                            ]
                        }
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3 position-relative">
                    <Form.Label
                        style={{
                            color: "#7126B5",
                            fontWeight: "bold",
                        }}
                    >
                        Berlaku Sampai
                    </Form.Label>
                    <div
                        style={{
                            position: "relative",
                            alignItems: "center",
                        }}
                    >
                        <Form.Control
                            id="dateOfExpiry1"
                            type="date"
                            style={{
                                width: "100%",
                            }}
                            readOnly={isSaved}
                            value={passanger.expiryDate}
                            onChange={(e) =>
                                handleInputChange(
                                    passanger.type,
                                    passanger.index,
                                    "expiryDate",
                                    e.target.value
                                )
                            }
                            isInvalid={
                                !!errors[
                                    `${passanger.type}-${passanger.index}-expiryDate`
                                ]
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                errors[
                                    `${passanger.type}-${passanger.index}-expiryDate`
                                ]
                            }
                        </Form.Control.Feedback>
                    </div>
                </Form.Group>
            </div>
        </Form>
    );
};

export default PassangerForm;
