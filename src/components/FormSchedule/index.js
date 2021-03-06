import React, { useEffect, useState } from 'react';
import { Button, TextField, CircularProgress, Select, FormControl, MenuItem, InputLabel, Grid, makeStyles } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { withRouter } from "react-router-dom";
import dateFnsFormat from 'date-fns/format';
import { formatDate } from '../../utils/formatDate';
import api from '../../services/api';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';
import moment from 'moment';

function FormSchedule({ onSubmit, schedule }) {
  const classes = useStyles();
  const MySwal = withReactContent(Swal);

  const [date, setDate] = useState(new Date());
  const [initial, setInitial] = useState(new Date());
  const [final, setFinal] = useState(new Date());
  const [equipament, setEquipament] = useState([]);
  const [course, setCourse] = useState('');
  const [category, setCategory] = useState('');
  const [place, setPlace] = useState('');
  const [requestingUser, setRequestingUser] = useState('');
  const [edited, setEdited] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [equipaments, setEquipaments] = useState([]);
  const [equipamentsView, setEquipamentsView] = useState([]);
  const [equipamentsSelected, setEquipamentsSelected] = useState([]);
  const [comments, setComments] = useState('');
  const [users, setUsers] = useState([]);
  const [disabledFixed, setDisabledFixed] = useState(true);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changeOrder, setChangeOrder] = useState(false);
  const userLogged = useSelector(state => state.userLogged.userLogged);

  useEffect(() => {
    if (schedule) {
      const dateSplit = schedule.date.split('T');
      const parse = dateSplit[0].split('-');

      setDate(new Date(parse[0], parse[1] - 1, parse[2]));
      //setEquipaments(schedule.equipaments);
      setInitial(schedule.initial);
      setFinal(schedule.final);
      setCourse(schedule.course);
      setCategory(schedule.category);
      //setPlace(schedule.place);
      setRequestingUser(schedule.requesting_user);
      setComments(schedule.comments);

      setEdited(true)
    }
  }, [schedule]);

  useEffect(() => {
    if (edited) {
      setEdited(false)
      disponibilty()
    }
  }, [edited])

  async function disponibilty() {
    if (!date) { MySwal.fire('Data não preenchida', 'O campo data deve ser preenchido!', 'error'); return }
    if (!initial) { MySwal.fire('Início não preenchido', 'O campo horário de início deve ser preenchido!', 'error'); return }
    if (!final) { MySwal.fire('Final não preenchido', 'O campo horário de fim deve ser preenchido!', 'error'); return }

    setIsLoadingVerification(true);
    await api.get("/availability", {
      headers: {
        initial: moment(initial).format("HH:mm"),
        final: moment(final).format("HH:mm"),
        date_a: moment(date).format("yyyy-MM-DD"),
        status: 'Confirmado'
      },
    })
      .then(function (response) {
        console.log(response.data);
        if (schedule) {
          const result = doIUseEquipamentsAndPlaceOfSchedule()
          let arrayPlace = []
          if (result) {
            setEquipaments([...schedule.equipaments, ...response.data.avaibilityEquipaments])
            setPlaces([schedule.place, ...response.data.avaibilityPlaces]);
            arrayPlace = [schedule.place, ...response.data.avaibilityPlaces]
          }
          else {
            setEquipaments(response.data.avaibilityEquipaments)
            setPlaces(response.data.avaibilityPlaces);
            arrayPlace = response.data.avaibilityPlaces
          }

          if (arrayPlace.length <= 0) { MySwal.fire('Sem salas disponíveis', 'Não há nenhuma sala disponível neste horário', 'error'); return }
        }
        else {
          setEquipaments(response.data.avaibilityEquipaments);
          setPlaces(response.data.avaibilityPlaces);

          if (response.data.avaibilityPlaces.length <= 0) { MySwal.fire('Sem salas disponíveis', 'Não há nenhuma sala disponível neste horário', 'error'); return }
        }
        setDisabledFixed(false);
        retrieveData();
      })
      .catch(function (error) {
        console.log(error);

        MySwal.fire('Oops...', error.response.data.error, 'error')
      });
    setIsLoadingVerification(false);
  }

  function doIUseEquipamentsAndPlaceOfSchedule() {
    if (schedule) {
      if ((schedule.initial != initial) || (schedule.final != final)) { return false }
      else { return true }
    }
  }

  async function retrieveData() {
    if (userLogged.function === 'adm') {
      await api.get("/users")
        .then(response => {
          const usersReceived = response.data.filter((elem) => {
            return elem.status === 'Ativo';
          });
          setUsers(usersReceived);
        })
        .catch(error => {
          console.log(error);
          MySwal.fire('Erro...', 'Erro ao obter lista de usuários!', 'error')
        })
    }
    else {
      setUsers([userLogged]);
    }

    await api.get("/categories")
      .then(response => {
        const categoriesReceived = response.data.filter((elem) => {
          return elem.status === 'Ativo';
        });
        setCategories(categoriesReceived);
      })
      .catch(error => {
        console.log(error);
        MySwal.fire('Erro...', 'Erro ao obter lista de categorias!', 'error')
      })

    await api.get("/courses")
      .then(response => {
        const coursesReceived = response.data.filter((elem) => {
          return elem.status === 'Ativo';
        });
        setCourses(coursesReceived);
      })
      .catch(error => {
        console.log(error);
        MySwal.fire('Erro...', 'Erro ao obter lista de cursos!', 'error')
      })
  }

  function selectEquipament() {
    if (equipamentsSelected.includes(equipament)) {
      MySwal.fire('Oops...', 'Este equipamento já foi selecionado!', 'error')
    }
    else {
      equipamentsSelected.push(equipament);
      let eqName;
      equipaments.map(eq => {
        if(eq.id == equipament) eqName = eq.name
      })
      setEquipamentsView([...equipamentsView, eqName]);
    }
  }

  function controlFields() {
    if (!disabledFixed) {
      setDisabledFixed(!disabledFixed);
    }
  }

  async function save(e) {
    e.preventDefault();
    if (!place) { MySwal.fire('Sala não preenchida', 'O campo sala deve ser preenchido!', 'error'); return }
    if (!category) { MySwal.fire('Ano não preenchido', 'O campo ano deve ser preenchido!', 'error'); return }
    if (!course) { MySwal.fire('Curso não preenchido', 'O campo curso deve ser preenchido!', 'error'); return }
    if (!requestingUser) { MySwal.fire('Solicitante não preenchido', 'O campo solicitante deve ser preenchido!', 'error'); return }

    setIsLoading(true);
    await onSubmit(schedule.id, {
      place_id: place,
      category_id: category,
      course_id: course,
      registration_user_id: userLogged.id,
      requesting_user_id: requestingUser,
      campus_id: userLogged.campus_id,
      comments,
      date: moment(date).format('yyyy-MM-DD'),
      initial: moment(initial).format('HH:mm'),
      final: moment(final).format('HH:mm'),
      equipaments: equipamentsSelected,
      status: "Confirmado"
    })
    clear()
    setIsLoading(false);
  }

  function clear() {
    controlFields();
    setEquipamentsView('');
    setComments('');
    setEquipament([]);
    setPlace('');
    setCourse('');
    setRequestingUser('');
    setCategory('');
    setEquipamentsSelected([]);
  }

  return (
    <form onSubmit={save} className={classes.form}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container spacing={1}>

          <Grid className={classes.center} container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <KeyboardDatePicker
                  className={classes.w100}
                  onFocus={controlFields}
                  onClick={controlFields}
                  margin="none"
                  inputVariant="outlined"
                  label="Data"
                  format="dd/MM/yyyy"
                  value={date}
                  onChange={setDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="ano-curso">Ano (curso)</InputLabel>
                <Select
                  labelId="ano-curso"
                  id="ano-select"
                  value={category}
                  disabled={disabledFixed}
                  className={classes.w100}
                  onChange={e => setCategory(e.target.value)}
                  label="Ano (curso)"
                >
                  {categories.map(category => (
                    <MenuItem value={category.id}>{category.description}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>


          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <KeyboardTimePicker
                  margin="none"
                  onFocus={controlFields}
                  onClick={controlFields}
                  inputVariant="outlined"
                  className={classes.w100}
                  id="time-picker"
                  label="Início"
                  ampm={false}
                  value={initial}
                  // format="HH:mm"
                  datatype
                  invalidDateMessage="Tempo inválido"
                  onChange={setInitial}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="solicitante">Solicitante</InputLabel>
                <Select
                  labelId="solicitante"
                  id="solicitante-select"
                  value={requestingUser}
                  disabled={disabledFixed}
                  className={classes.w100}
                  onChange={e => setRequestingUser(e.target.value)}
                  label="Solicitante"
                >
                  {users.map(user => (
                    <MenuItem value={user.id}>{user.fullname}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>


          <Grid className={classes.center} container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <KeyboardTimePicker
                  margin="none"
                  onFocus={controlFields}
                  onClick={controlFields}
                  inputVariant="outlined"
                  className={classes.w100}
                  id="time-picker"
                  label="Fim"
                  ampm={false}
                  format="HH:mm"
                  value={final}
                  onChange={setFinal}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="curso">Curso</InputLabel>
                <Select
                  labelId="curso"
                  id="curso-select"
                  disabled={disabledFixed}
                  value={course}
                  className={classes.w100}
                  onChange={e => setCourse(e.target.value)}
                  label="Curso"
                >
                  {courses.map(course => (
                    <MenuItem value={course.id}>{course.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>


          <Grid className={classes.center} container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="sala">Sala</InputLabel>
                <Select
                  labelId="sala"
                  id="sala-select"
                  value={place}
                  className={classes.w100}
                  onChange={e => setPlace(e.target.value)}
                  label="Sala"
                  disabled={disabledFixed}
                  required
                >
                  {places.map(place => (
                    <MenuItem value={place.id}>{place.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="equipamentos">Equipamentos</InputLabel>
                <Select
                  labelId="equipamentos"
                  id="equipamento-select"
                  disabled={disabledFixed}
                  value={equipament}
                  className={classes.w100}
                  onChange={e => setEquipament(e.target.value)}
                  label="Equipamentos"
                >
                  {equipaments.map(equi => (
                    <MenuItem value={equi.id}>{equi.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Button disabled={disabledFixed} onClick={selectEquipament} className={classes.buttons} variant="contained" color="primary">
                  Sel. equipamento
                  </Button>
              </FormControl>
            </Grid>
          </Grid>


          <Grid className={classes.center} container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  className={classes.w100}
                  label="Observações"
                  multiline
                  disabled={disabledFixed}
                  rows={3}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Observações"
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  className={classes.w100}
                  label="Equipamentos selecionados"
                  multiline
                  disabled
                  rows={3}
                  placeholder="Seus equipamentos selecionados aparecerão aqui"
                  variant="outlined"
                  value={equipamentsView.toString()}
                />
              </FormControl>
            </Grid>
          </Grid>


          <Grid className={classes.center} container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Button onClick={disponibilty} className={classes.buttons} variant="contained" color="primary">
                  Ver. disponibilidade
                  {isLoadingVerification && <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" />}
                </Button>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Button type="submit" onClick={save} disabled={disabledFixed} className={classes.buttons} variant="contained" color="primary">
                  Salvar
                  {isLoading && <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" />}
                </Button>
              </FormControl>
            </Grid>
          </Grid>


        </Grid>
      </MuiPickersUtilsProvider>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  buttons: {
    paddingTop: 15.5,
    paddingBottom: 15.5,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: "#042963"
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  form: {
    // flexGrow: 1,
    width: '70%'
  },
  w100: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  }
}));
export default FormSchedule;
// export default withRouter(FormSchedule);