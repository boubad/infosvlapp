<script lang="ts">
    import { Container, Col, Form, Row } from "sveltestrap";
    import { DomainConstants } from "../../../data/domain/DomainConstants";
    import InputText from "../../components/InputText.svelte";
    //
    import {
        TITLE_FILTER_ETUDIANT_INFOS,
        PROMPT_DEPARTEMENT,
        PROMPT_VILLE,
        PROMPT_ETABLISSEMENT,
        PROMPT_SERIEBAC,
        PROMPT_OPTIONBAC,
        PROMPT_MENTIONBAC,
        PROMPT_ETUDESSUPERIEURES,
        PROMPT_REDOUBLANT,
        PROMPT_TYPEFORMATION,
        PROMPT_DOSSIER,
    } from "../InfoPrompt";
    import { etudiantfilterstore } from "../../stores/EtudiantStore";
    import { busystore } from "../../stores/BusyStore";
    //
    $: filter = $etudiantfilterstore;
    $: departement = filter.departement ? filter.departement : "";
    $: ville = filter.ville ? filter.ville : "";
    $: etablissement = filter.etablissement ? filter.etablissement : "";
    $: seriebac = filter.seriebac ? filter.seriebac : "";
    $: optionbac = filter.optionbac ? filter.optionbac : "";
    $: mentionbac = filter.mentionbac ? filter.mentionbac : "";
    $: sup = filter.sup ? filter.sup : "";
    $: redoublant = filter.redoublant ? filter.redoublant : "";
    $: typeformation = filter.typeformation ? filter.typeformation : "";
    $: dossier = filter.dossier ? filter.dossier : "";
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
            <h2>{TITLE_FILTER_ETUDIANT_INFOS}</h2>
        </Col>
    </Row>
    <Row>
        <Form>
            <Row>
                <Col>
                    <InputText
                        value={departement}
                        label={PROMPT_DEPARTEMENT}
                        name={DomainConstants.FIELD_DEPARTEMENT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={ville}
                        label={PROMPT_VILLE}
                        name={DomainConstants.FIELD_VILLE}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={etablissement}
                        label={PROMPT_ETABLISSEMENT}
                        name={DomainConstants.FIELD_ETABLISSEMENT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={seriebac}
                        label={PROMPT_SERIEBAC}
                        name={DomainConstants.FIELD_SERIEBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={optionbac}
                        label={PROMPT_OPTIONBAC}
                        name={DomainConstants.FIELD_OPTIONBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={mentionbac}
                        label={PROMPT_MENTIONBAC}
                        name={DomainConstants.FIELD_MENTIONBAC}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={sup}
                        label={PROMPT_ETUDESSUPERIEURES}
                        name={DomainConstants.FIELD_ETUDESSUPERIEURES}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={redoublant}
                        label={PROMPT_REDOUBLANT}
                        name={DomainConstants.FIELD_REDOUBLANT}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
                <Col>
                    <InputText
                        value={typeformation}
                        label={PROMPT_TYPEFORMATION}
                        name={DomainConstants.FIELD_TYPEFORMATION}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputText
                        value={dossier}
                        label={PROMPT_DOSSIER}
                        name={DomainConstants.FIELD_DOSSIER}
                        {busy}
                        {onValueChanged}
                    />
                </Col>
            </Row>
        </Form>
    </Row>
</Container>
