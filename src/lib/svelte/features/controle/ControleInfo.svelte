<script lang="ts">
  import { Container, Col, Form, Row } from "sveltestrap";
  import ControleTypeChoice from "../../components/ControleTypeChoice.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import InputCoefficient from "../../components/InputCoefficient.svelte";
  import InputDate from "../../components/InputDate.svelte";
  import InputText from "../../components/InputText.svelte";
  import ItemChoice from "../../components/ItemChoice.svelte";
  import InputHasNotes from "../../components/InputHasNotes.svelte";
  import EditCommands from "../../components/EditCommands.svelte";
  import type { IDataOption } from "../../../data/domain/IDataOption";
  import type { IControleDoc } from "../../../data/domain/IControleDoc";
  import { CreateControle } from "../../../data/domain/IControleDoc";
  import { ControleType } from "../../../data/domain/ControleType";
  import { onMount } from "svelte";
  import { InfoDataStore } from "../../../data/services/InfoDataStore";
  import {
    PROMPT_COEFFICIENT,
    PROMPT_DATE,
    PROMPT_DURATION,
    PROMPT_GROUPECONTROLES,
    PROMPT_NAME,
    PROMPT_PLACE,
  } from "../InfoPrompt";
  import { DomainConstants } from "../../../data/domain/DomainConstants";
  import { currentaffectationstore } from "../../stores/GlobalStores";
  import { busystore } from "../../stores/BusyStore";
  import { currentcontrolestore } from "../../stores/ControleStore";
  import { GetControleTitle } from "../../../data/services/miscutils";
  //
  let items: IDataOption[] = [];
  let prev: IControleDoc = CreateControle();
  //
  $: controle = $currentcontrolestore;
  $: controletitle = GetControleTitle(controle);
  $: affectation = $currentaffectationstore;
  $: busy = $busystore;
  $: isModified =
    controle._modified !== undefined &&
    controle._modified !== null &&
    controle._modified === true;
  $: storeable =
    isModified &&
    controle.controletype != ControleType.Unknown &&
    controle.groupecontroleid.trim().length > 0 &&
    controle.affectationid.trim().length > 0 &&
    controle.date.trim().length > 0 &&
    controle.name.trim().length > 0;
  //
  const onValueChanged = (val: any, name: string) => {
    const pp = Object.assign({}, controle);
    pp[name] = val;
    pp._modified = true;
    controle = pp;
  };
  const performCancel = async () => {
    controle = prev;
  };
  const performSave = async () => {
    busystore.set(true);
    try {
      const store = new InfoDataStore();
      const r = await store.maintainsDocAsync(controle);
      if (r !== undefined && r !== null && r.length > 0) {
        await performRefresh(r);
      }
    } catch (e) {}
    busystore.set(false);
  };
  const performRemove = async () => {
    busystore.set(true);
    try {
      const store = new InfoDataStore();
      const r = await store.removeDocAsync(controle._id);
      await performRefresh();
      controle = CreateControle();
      prev = CreateControle();
    } catch (e) {}
    busystore.set(false);
  };
  //
  const performRefresh = async (id?: string) => {
    busystore.set(true);
    try {
      const controleid =
        id !== undefined && id !== null ? "" + id : controle._id;
      if (controleid.length > 0) {
        const store = new InfoDataStore();
        const p = await store.findControleByIdAsync(controleid);
        if (p !== undefined && p !== null) {
          $currentcontrolestore = p;
          controle = p;
          prev = Object.assign({}, controle);
        }
      }
      isModified =
        controle._modified !== undefined &&
        controle._modified !== null &&
        controle._modified === true;
      storeable =
        isModified &&
        controle.controletype != ControleType.Unknown &&
        controle.groupecontroleid.trim().length > 0 &&
        controle.affectationid.trim().length > 0 &&
        controle.date.trim().length > 0 &&
        controle.name.trim().length > 0;
    } catch (e) {
      console.log(e);
    } finally {
      busystore.set(false);
    }
  }; // performRefresh
  //
  onMount(async () => {
    await performRefresh();
  });
  //
</script>

<Container>
  <Row>
    <Col>
      <h2 class="text-center">{controletitle}</h2>
    </Col>
  </Row>
  <Row>
    <Col>
      <Form>
        <Row>
          <Col>
            <ControleTypeChoice
              value={controle.controletype}
              {busy}
              {onValueChanged}
            />
          </Col>
          <Col>
            <InputDate
              value={controle.date}
              label={PROMPT_DATE}
              name={DomainConstants.FIELD_DATE}
              {busy}
              min={affectation.startdate}
              max={affectation.enddate}
              {onValueChanged}
            />
          </Col>
          <Col>
            <InputHasNotes value={controle.hasnotes} {busy} {onValueChanged} />
          </Col>
        </Row>
        <Row>
          <Col>
            <ItemChoice
              value={controle.groupecontroleid}
              label={PROMPT_GROUPECONTROLES}
              name={DomainConstants.FIELD_GROUPECONTROLEID}
              {items}
              {busy}
              {onValueChanged}
            />
          </Col>
          <Col>
            <InputText
              value={controle.name}
              label={PROMPT_NAME}
              name={DomainConstants.FIELD_NAME}
              {busy}
              {onValueChanged}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputText
              value={controle.place}
              label={PROMPT_PLACE}
              name={DomainConstants.FIELD_PLACE}
              {busy}
              {onValueChanged}
            />
          </Col>
          <Col>
            <InputText
              value={controle.duration}
              label={PROMPT_DURATION}
              name={DomainConstants.FIELD_DURATION}
              {busy}
              {onValueChanged}
            />
          </Col>
          <Col>
            <InputCoefficient
              value={controle.coefficient}
              label={PROMPT_COEFFICIENT}
              name={DomainConstants.FIELD_COEFFICIENT}
              {busy}
              {onValueChanged}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputObservations
              value={controle.observations}
              {busy}
              {onValueChanged}
            />
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
  <EditCommands
    {busy}
    cancancel={isModified}
    canremove={controle._rev.length > 0}
    cansave={storeable}
    onCancel={performCancel}
    onRemove={performRemove}
    onSave={performSave}
  />
</Container>
