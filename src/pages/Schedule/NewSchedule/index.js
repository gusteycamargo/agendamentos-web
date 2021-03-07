import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormSchedule from '../../../components/FormSchedule';
import NavBar from '../../../components/NavBar';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from '../../../services/api';
import { withRouter } from "react-router-dom";

function NewSchedule() {
  const classes = useStyles();
  const MySwal = withReactContent(Swal);  

  async function save(id, data) {
      await api.post("/schedules", data)
      .then(function (response) {
          MySwal.fire('Prontinho', 'Agendamento realizado com sucesso!', 'success');
      })
      .catch(function (error) {
          MySwal.fire('Oops...', 'Houve um erro ao realizar seu agendamento, tente novamente!', 'error');
      });
  }

  return (<>
    <NavBar/>
    <div className={classes.root}>
      <FormSchedule onSubmit={save} schedule={''}/>
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

export default withRouter(NewSchedule);
