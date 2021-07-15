<script lang="ts">
  import { Container, Col, Form, Row } from "sveltestrap";
  import InputDate from "../../components/InputDate.svelte";
  import InputText from "../../components/InputText.svelte";
  import InputObservations from "../../components/InputObservations.svelte";
  import SexeChoice from "../../components/SexeChoice.svelte";
  import {
    PROMPT_ADDRESS,
    PROMPT_BIRTHDATE,
    PROMPT_EMAIL,
    PROMPT_FIRSTNAME,
    PROMPT_LASTNAME,
    PROMPT_PHONE,
    TITLE_FILTER_ETUDIANT_IDENT,
  } from "../InfoPrompt";
  import { DomainConstants } from "../../../data/domain/DomainConstants";
  import { etudiantfilterstore } from "../../stores/EtudiantStore";
  import { busystore } from "../../stores/BusyStore";
  //
  $: filter = $etudiantfilterstore;
  $: sexe = filter.sexe ? filter.sexe : "";
  $: birthdate = filter.birthdate ? filter.birthdate : "";
  $: lastname = filter.lastname ? filter.lastname : "";
  $: firstname = filter.firstname ? filter.firstname : "";
  $: email = filter.email ? filter.email : "";
  $: phone = filter.phone ? filter.phone : "";
  $: address = filter.address ? filter.address : "";
  $: busy = $busystore;
  //

  const onValueChanged = (val: any, name: string) => {
    if (name !== undefined && name !== null) {
      const pp: any = {};
      let bRemove = true;
      if (val !== undefined && val !== null) {
        const s = "" + val;
        bRemove = s.trim().length < 1;
      }
      for (const key in filter) {
        if (bRemove && key === name) {
          continue;
        }
        const v = filter[key];
        if (v !== undefined && v !== null) {
          const sv = "" + v;
          if (sv.trim().length > 0) {
            pp[key] = sv;
          }
        } // v
      } // key
      if (!bRemove) {
        pp[name] = val;
      }
      filter = pp;
      etudiantfilterstore.set(pp);
    } // name
  };
  //
</script>

<Container>
  <Row>
    <Col>
      <h2>{TITLE_FILTER_ETUDIANT_IDENT}</h2>
    </Col>
  </Row>
  <Row>
    <Form>
      <Row>
        <Col>
          <SexeChoice value={sexe} {busy} {onValueChanged} />
        </Col>
        <Col>
          <InputDate
            value={birthdate}
            label={PROMPT_BIRTHDATE}
            name={DomainConstants.FIELD_BIRTHDATE}
            {busy}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={lastname}
            label={PROMPT_LASTNAME}
            name={DomainConstants.FIELD_LASTNAME}
            {busy}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={firstname}
            label={PROMPT_FIRSTNAME}
            name={DomainConstants.FIELD_FIRSTNAME}
            {busy}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={email}
            label={PROMPT_EMAIL}
            name={DomainConstants.FIELD_EMAIL}
            {busy}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputText
            value={phone}
            label={PROMPT_PHONE}
            name={DomainConstants.FIELD_PHONE}
            {busy}
            {onValueChanged}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            value={address}
            label={PROMPT_ADDRESS}
            name={DomainConstants.FIELD_ADDRESS}
            {busy}
            {onValueChanged}
          />
        </Col>
        <Col>
          <InputObservations
            value={DomainConstants.FIELD_OBSERVATIONS}
            {busy}
            {onValueChanged}
          />
        </Col>
      </Row>
    </Form>
  </Row>
</Container>
