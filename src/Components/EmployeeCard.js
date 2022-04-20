import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import moment from "moment";

export default function EmployeeCard({ id, image, name, data, onViewProfile }) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={image}
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {moment(data.dob.date).format("DD-MMM-YYYY")}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => onViewProfile(id)}>
                    View Profile
                </Button>
            </CardActions>
        </Card>
    );
}
