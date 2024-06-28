import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import { vi } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogAssetList from '../../components/DialogAssetList';
import DialogUserList from '../../components/DialogUserList';
import { EditAssignmentAPI, GetAssignment } from '../../services/assignments.service';
// import { format } from 'date-fns';

const PopupNotification = ({
    open,
    handleClose,
    title,
    content,
    closeContent,
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogTitle sx={{ color: "#D6001C", fontWeight: "bold", minWidth: 400 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: "white",
                        bgcolor: "#D6001C",
                        "&:hover": { bgcolor: "#D6001C" },
                    }}
                >
                    {closeContent ? closeContent : "Ok"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
};
const EditAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [firstAsset, setFirstAsset] = useState("");
    const [firstUser, setFirstUser] = useState("");
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [visibleAssetDialog, setVisibleAssetDialog] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [titlePopup, setTitlePopup] = useState(false);
    const [contentPopup, setContentPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState({ assignedDate: null });
    const [initialValue, setInitialValue] = useState({ asset: "", user: "", assignedDate: "", note: "" });
    const [currentValue, setCurrentValue] = useState({ asset: "", user: "", assignedDate: "", note: "" });
    const [formErrors, setFormErrors] = useState({
        user: false,
        asset: false,
        assignedDate: false,
        note: false,
    });
    const [touched, setTouched] = useState({
        assignedDate: false,
        user: false,
        asset: false
    });

    const handleFieldChange = (name, value) => {
        setCurrentValue(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleNoteChange = (event) => {
        const { name, value } = event.target;
        let errorMessage = "";
        if (name === "note" && value.length > 600) {
            errorMessage = "Note must not exceed 600 characters";
        }
        handleFieldChange(name, value);
        setSelectedAssignment({ ...selectedAssignment, [name]: value });
        setFormErrors({ ...formErrors, [name]: errorMessage });
    };

    const formatDateOnly = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const getAssignmentById = async () => {
            try {
                const response = await GetAssignment(id);
                if (response) {
                    setSelectedUser(response.assignedTo);
                    setSelectedAsset(response.asset);
                    setFirstAsset(response.asset);
                    setFirstUser(response.assignedTo);

                    const initialAsset = response.asset ? response.asset.assetName : "";
                    const initialUser = response.assignedTo ? response.assignedTo.userName : "";
                    setInitialValue({ asset: initialAsset, user: initialUser, assignedDate: new Date(response.assignedDate), note: response.note });
                    setCurrentValue({ asset: initialAsset, user: initialUser, assignedDate: new Date(response.assignedDate), note: response.note });
                    setSelectedAssignment({
                        ...response,
                        assignedDate: new Date(response.assignedDate),
                    });
                }
            } catch (error) {
                setTitlePopup("Error");
                setContentPopup(`Failed to fetch user data: ${error.message}`);
                displayPopupNotification();
            }
        }
        getAssignmentById(id);
    }, [id])


    useEffect(() => {
        let errorMessage = "";
        if (touched.assignedDate) {
            if (!selectedAssignment.assignedDate) {
                errorMessage = "Assigned date is required";
            } else {
                const assignedDateOnly = formatDateOnly(selectedAssignment.assignedDate);
                const todayDateOnly = formatDateOnly(new Date());

                if (assignedDateOnly < todayDateOnly) {
                    errorMessage = "Cannot select Assigned Date in the past. Please select another date.";
                } else if (!(selectedAssignment.assignedDate instanceof Date) || isNaN(selectedAssignment.assignedDate.getTime())) {
                    errorMessage = "Invalid date";
                }
            }
        }

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            assignedDate: errorMessage,
        }));
    }, [selectedAssignment.assignedDate, touched.assignedDate]);

    useEffect(() => {
        let errorMessage = "";
        if (touched.user && !selectedUser) {
            errorMessage = "User is required";
        }
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            user: errorMessage,
        }));
    }, [visibleDialog, selectedUser, touched.user]);

    useEffect(() => {
        let errorMessage = "";
        if (touched.asset && !selectedAsset) {
            errorMessage = "Asset is required";
        }
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            asset: errorMessage,
        }));
    }, [visibleAssetDialog, selectedAsset, touched.asset]);

    const isSingleFieldChanged = () => {
        const assetChanged = initialValue.asset !== currentValue.asset;
        const userChanged = initialValue.user !== currentValue.user;
        const assignedDateChanged = new Date(initialValue.assignedDate).getTime() !== new Date(currentValue.assignedDate).getTime();
        const noteChanged = initialValue.note !== currentValue.note;

        return [assetChanged, userChanged, assignedDateChanged, noteChanged].filter(Boolean).length === 1;
    };

    const isFormValid = () => {
        return !formErrors.asset && currentValue.asset && !formErrors.user && currentValue.user;
    };

    const handleDateChange = (name, date) => {
        setSelectedAssignment({ ...selectedAssignment, [name]: date });
        handleFieldChange(name, date);
        setTouched({ ...touched, [name]: true });
    };

    const handleDateBlur = (name) => {
        setTouched({ ...touched, [name]: true });
    };

    const handleUserDialogOpen = () => {
        setTouched({ ...touched, user: true });
        setVisibleDialog(true);
    };

    const handleUserDialogClose = () => {
        setVisibleDialog(false);
    };

    const handleAssetDialogOpen = () => {
        setTouched({ ...touched, asset: true });
        setVisibleAssetDialog(true);
    };

    const handleAssetDialogClose = () => {
        setVisibleAssetDialog(false);
    };
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSelectedAssignment((prev) => ({
            ...prev,
            assignedTo: user,
            assignedToId: user.id
        }));
        handleFieldChange("user", user.userName);
        handleUserDialogClose();
    };

    const handleAssetSelect = (asset) => {
        setSelectedAsset(asset);
        setSelectedAssignment((prev) => ({
            ...prev,
            asset: asset,
        }));
        handleFieldChange('asset', asset.assetName);
        handleAssetDialogClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const edit = {
                assignedToId: selectedAssignment.assignedToId,
                assignedDate: selectedAssignment.assignedDate ? formatDate(selectedAssignment.assignedDate) : null,
                assetId: selectedAssignment.asset.id,
                note: selectedAssignment.note
            }
            const response = await EditAssignmentAPI(id, edit);

            if (response) {
                sessionStorage.setItem("assignment_created", JSON.stringify(response));
                setTitlePopup("Notifications");
                setContentPopup(
                    "Update successfully"
                );
                displayPopupNotification()
            }
        } catch (error) {
            setTitlePopup("Error");
            setContentPopup(`error: ${error.DevMessage}`);
            displayPopupNotification()
        }
    }

    const displayPopupNotification = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        navigate("/manage-assignment");
    };

    return (
        <>
            <Container sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <Box sx={{ width: "60%", borderRadius: 1, p: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2,
                            color: "#d32f2f",
                            fontWeight: "bold",
                            fontSize: "20px",
                        }}
                    >
                        Edit Assignment
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                            <Grid
                                item
                                xs={3}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Typography onClick={handleUserDialogOpen}>
                                    User
                                    <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    sx={{
                                        "& label.Mui-focused": { color: "#000" },
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": { borderColor: "#000" },
                                        },
                                        "&:hover": { cursor: "pointer" },
                                    }}
                                    placeholder="User"
                                    fullWidth
                                    name="user"
                                    value={
                                        selectedAssignment.assignedTo
                                            ? `${selectedAssignment.assignedTo.firstName} ${selectedAssignment.assignedTo.lastName}`
                                            : ""
                                    }
                                    onClick={handleUserDialogOpen}
                                    margin="dense"
                                    error={formErrors.user}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleUserDialogOpen}>
                                                <SearchIcon />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                {formErrors.user && (
                                    <FormHelperText error>{formErrors.user}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={3} sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <Typography handleAssetDialogOpen>
                                    Asset
                                    <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    sx={{
                                        "& label.Mui-focused": { color: "#000" },
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": { borderColor: "#000" },
                                        },
                                        "&:hover": { cursor: "pointer" },
                                    }}
                                    placeholder="Asset"
                                    fullWidth
                                    name="asset"
                                    value={selectedAssignment.asset ? `${selectedAssignment.asset.assetName}` : ''}
                                    onClick={handleAssetDialogOpen}
                                    margin="dense"
                                    error={formErrors.asset}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleAssetDialogOpen}>
                                                <SearchIcon />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                {formErrors.asset && (
                                    <FormHelperText error>{formErrors.asset}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                                <Typography>
                                    Assigned Date
                                    <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
                                    <DatePicker
                                        slotProps={{
                                            textField: {
                                                error: formErrors.assignedDate && touched.assignedDate,
                                                onBlur: () => handleDateBlur("assignedDate"),
                                            },
                                        }}
                                        sx={{
                                            "& label.Mui-focused": { color: "#000" },
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": { borderColor: "#000" },
                                            },
                                        }}
                                        format="dd/MM/yyyy"
                                        label="Assigned Date"
                                        value={selectedAssignment.assignedDate}
                                        onChange={(date) => handleDateChange("assignedDate", date)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                margin="dense"
                                                required
                                                error={formErrors.assignedDate && touched.assignedDate}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                {formErrors.assignedDate && (
                                    <FormHelperText error>
                                        {formErrors.assignedDate}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                                <Typography>
                                    Note
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    sx={{
                                        "& label.Mui-focused": { color: "#000" },
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": { borderColor: "#000" },
                                        },
                                    }}
                                    rows={4}
                                    multiline
                                    placeholder="Note"
                                    fullWidth
                                    name="note"
                                    value={selectedAssignment.note}
                                    onChange={handleNoteChange}
                                    margin="dense"
                                    error={formErrors.note}
                                />
                                {formErrors.note && (
                                    <FormHelperText error>{formErrors.note}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                                >
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        sx={{
                                            backgroundColor: "#d32f2f",
                                            mr: 3,
                                            "&:hover": {
                                                backgroundColor: "#a50000",
                                            },
                                        }}
                                        disabled={!isSingleFieldChanged() || !isFormValid()}
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate("/manage-assignment")}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                    {visibleDialog && (
                        <DialogUserList
                            firstUser={firstUser}
                            visibleDialog={visibleDialog}
                            setVisibleDialog={setVisibleDialog}
                            onSelect={handleUserSelect}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    )}

                    {visibleAssetDialog && (
                        <DialogAssetList
                            firstAsset={firstAsset}
                            visibleAssetDialog={visibleAssetDialog}
                            setVisibleAssetDialog={setVisibleAssetDialog}
                            onSelect={handleAssetSelect}
                            selectedAsset={selectedAsset}
                            setSelectedAsset={setSelectedAsset}
                        />
                    )}
                </Box>
            </Container>
            <PopupNotification
                open={openPopup}
                handleClose={handleClosePopup}
                title={titlePopup}
                content={contentPopup}
            />
        </>
    );
};

export default EditAssignment;
