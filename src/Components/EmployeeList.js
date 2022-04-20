import { Button, Grid, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AppDialog from "../modal/Dialog";
import EmployeeCard from "./EmployeeCard";

let empFullList = [];
const EmployeeList = () => {
    const [empList, setEmpList] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const empDetails = [
        { title: "Email", key: "email" },
        { title: "Phone Number", key: "phone" },
        {
            title: "Street Name",
            key: "location.street.name",
            isToResolve: true,
        },
        { title: "City", key: "location.city", isToResolve: true },
        { title: "State", key: "location.state", isToResolve: true },
        { title: "Postal Code", key: "location.postcode", isToResolve: true },
        { title: "Country", key: "location.country", isToResolve: true },
    ];
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [searchValue, setSearchValue] = useState("");

    function resolve(path, obj) {
        return path.split(".").reduce(function (prev, curr) {
            return prev ? prev[curr] : null;
        }, obj || null);
    }

    const searchKeys = [
        {
            key: "dob.date",
            expression: (input) => {
                const convertedSearchValue = parseInt(searchValue);
                const inputAsDate = moment(input);
                if (!isNaN(convertedSearchValue) && inputAsDate.isValid()) {
                    if (
                        inputAsDate.year() === convertedSearchValue ||
                        inputAsDate.month() + 1 === convertedSearchValue
                    ) {
                        return true;
                    }
                    return false;
                }
                return false;
            },
        },
        {
            key: "gender",
        },
        {
            key: "location.city",
        },
        {
            key: "location.country",
        },
        {
            key: "location.state",
        },
        {
            key: "location.street.name",
        },
    ];

    const getEmployeeList = (d) => {
        return d.length > 0 ? (
            <Grid container>
                {d.map((emp) => {
                    return (
                        <Grid
                            item
                            key={`grid-item-${emp.login.uuid}`}
                            style={{
                                width: "18rem",
                                height: "20rem",
                                margin: "20px",
                            }}
                        >
                            <div key={`div-${emp.login.uuid}`}>
                                <EmployeeCard
                                    image={emp.picture.large}
                                    name={`${emp.name.title} ${emp.name.first} ${emp.name.last}`}
                                    data={emp}
                                    onViewProfile={onViewEmployee}
                                    id={emp.login.uuid}
                                    key={emp.login.uuid}
                                />
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
        ) : (
            <div>No Result Found</div>
        );
    };

    const onViewEmployee = (id) => {
        const empInfo = empList.find((e) => e.login.uuid === id);
        console.log("Employee info ", empInfo);
        setSelectedEmployee(empInfo);
        setShowDialog(true);
    };

    const showEmployeeDtls = (emp) => {
        return [...empDetails].map((o, i) => {
            let val = o.isToResolve ? resolve(o.key, emp) : emp[o.key];
            if (val) {
                return (
                    <div>
                        <label key={i}>{`${o.title} : ${val}`}</label>
                    </div>
                );
            }
            return null;
        });
    };

    const onCloseDialog = () => {
        setShowDialog(false);
    };

    const searchEmployee = () => {
        setEmpList(
            empFullList.filter((emp) => {
                let result = false;
                searchKeys.forEach((obj) => {
                    if (!result) {
                        const value = resolve(obj.key, emp);
                        if (obj.expression) {
                            result = obj.expression(value);
                        } else if (value && value===searchValue) {
                            result = true;
                        }
                    }
                });
                return result;
            })
        );
    };

    const fetchEmployees = () => {
        setSearchValue("");
        fetch("https://randomuser.me/api/?results=10")
            .then((response) => response.json())
            .then((data) => {
                setEmpList(data.results);
                empFullList = data.results;
                setIsLoading(false);
            });
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div>
            {isLoading ? (
                "loading..."
            ) : (
                <>
                    <div>
                        <TextField
                            id="serach-input"
                            size="small"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            style={{ margin: "5px" }}
                            onClick={searchEmployee}
                        >
                            Search
                        </Button>

                        <Button
                            variant="outlined"
                            style={{ margin: "5px" }}
                            onClick={fetchEmployees}
                        >
                            Refresh
                        </Button>
                    </div>
                    {getEmployeeList(empList)}
                </>
            )}
            {showDialog ? (
                <AppDialog
                    key={`dialog-${selectedEmployee.login.uuid}`}
                    open={showDialog}
                    onClose={onCloseDialog}
                    content={showEmployeeDtls(selectedEmployee)}
                    title={selectedEmployee.name.first}
                />
            ) : null}
        </div>
    );
};

export default EmployeeList;
