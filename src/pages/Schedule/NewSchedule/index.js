import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormSchedule from '../../../components/FormSchedule';
import NavBar from '../../../components/NavBar';

function NewSchedule() {
  const classes = useStyles();

  return (<>
    <NavBar/>
    <div className={classes.root}>
      <FormSchedule/>
    </div>
  </>);
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35
  }
}));

export default NewSchedule;
