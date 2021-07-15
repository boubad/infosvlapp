<script lang="ts">
	import { onMount } from "svelte";
	import { Col, Form, Row } from "sveltestrap";
	import { DomainConstants } from "../../../data/domain/DomainConstants";
	import type { IGlobalStatePayload } from "../../../data/services/IGlobalStatePayload";
	import { GlobalServices } from "../../../data/services/GlobalServices";
	import {
		anneesstore,
		currentaffectationstore,
		currentanneestore,
		currentgroupestore,
		currentmatierestore,
		currentsemestrestore,
		currentunitestore,
		groupesstore,
		matieresstore,
		semestresstore,
		unitesstore,
	} from "../../stores/GlobalStores";
	import {
		controleetudiantsstore,
		controlesstore,
		groupecontrolesstore,
	} from "../../stores/ControleStore";
	import { busystore } from "../../stores/BusyStore";
	import ItemChoice from "../../components/ItemChoice.svelte";
	import {
		PROMPT_ANNEE,
		PROMPT_GROUPE,
		PROMPT_MATIERE,
		PROMPT_SEMESTRE,
		PROMPT_UNITE,
	} from "../InfoPrompt";
	//
	$: annee = $currentanneestore;
	$: semestre = $currentsemestrestore;
	$: matiere = $currentmatierestore;
	$: groupe = $currentgroupestore;
	$: unite = $currentunitestore;
	//
	const _reduceGlobal = async (p: IGlobalStatePayload) => {
		if (p.annees !== undefined && p.annees !== null) {
			$anneesstore = p.annees;
		}
		if (p.annee !== undefined && p.annee !== null) {
			$currentanneestore = p.annee._id;
		}
		if (p.semestres !== undefined && p.semestres !== null) {
			$semestresstore = p.semestres;
		}
		if (p.semestre !== undefined && p.semestre !== null) {
			$currentsemestrestore = p.semestre._id;
		}
		if (p.unites !== undefined && p.unites !== null) {
			$unitesstore = p.unites;
		}
		if (p.unite !== undefined && p.unite !== null) {
			$currentunitestore = p.unite._id;
		}
		if (p.groupes !== undefined && p.groupes !== null) {
			$groupesstore = p.groupes;
		}
		if (p.groupe !== undefined && p.groupe !== null) {
			$currentgroupestore = p.groupe._id;
		}
		if (p.matieres !== undefined && p.matieres !== null) {
			$matieresstore = p.matieres;
		}
		if (p.matiere !== undefined && p.matiere !== null) {
			$currentmatierestore = p.matiere._id;
		}
		if (p.groupescontroles !== undefined && p.groupescontroles !== null) {
			$groupecontrolesstore = p.groupescontroles;
		}
		if (p.etudiants !== undefined && p.etudiants !== null) {
			$controleetudiantsstore = p.etudiants;
		}
		if (p.controles !== undefined && p.controles !== null) {
			$controlesstore = p.controles;
		}
		if (p.affectation !== undefined && p.affectation !== null) {
			$currentaffectationstore = p.affectation;
		}
	}; // _reduceGlobal
	//
	const onValueChanged = async (val: any, name: string) => {
		$busystore = true;
		try {
			const pMan = new GlobalServices();
			let p: IGlobalStatePayload = undefined;
			const id = "" + val;
			switch (name) {
				case DomainConstants.FIELD_ANNEEID:
					p = await pMan.changeAnneeIdAsync(
						id,
						semestre,
						matiere,
						groupe
					);
					break;
				case DomainConstants.FIELD_SEMESTREID:
					p = await pMan.changeSemestreIdAsync(
						id,
						annee,
						matiere,
						groupe
					);
					break;
				case DomainConstants.FIELD_UNITEID:
					p = await pMan.changeUniteIdAsync(
						id,
						annee,
						semestre,
						matiere,
						groupe
					);
					break;
				case DomainConstants.FIELD_MATIEREID:
					p = await pMan.changeMatiereIdAsync(
						id,
						annee,
						semestre,
						groupe
					);
					break;
				case DomainConstants.FIELD_GROUPEID:
					p = await pMan.changeGroupeIdAsync(
						id,
						annee,
						semestre,
						matiere
					);
					break;
				default:
					break;
			} // name
			if (p !== undefined && p !== null) {
				_reduceGlobal(p);
			}
		} catch (e) {
			console.log(e);
		}
		$busystore = false;
	}; // onValueChanged
	//
	const performRefresh = async () => {
		$busystore = true;
		try {
			const pMan = new GlobalServices();
			const p = await pMan.refreshAllAsync(
				annee,
				semestre,
				unite,
				matiere,
				groupe
			);
			_reduceGlobal(p);
		} catch (e) {
			console.log(e);
		}
		$busystore = false;
	};
	//
	onMount(async () => {
		await performRefresh();
	});
	//
</script>

<Form>
	<Row>
		{#if $anneesstore.length > 1}
			<Col>
				<ItemChoice
					value={$currentanneestore}
					label={PROMPT_ANNEE}
					name={DomainConstants.FIELD_ANNEEID}
					busy={$busystore}
					items={$anneesstore}
					{onValueChanged}
				/>
			</Col>
		{/if}
		{#if $semestresstore.length > 1}
			<Col>
				<ItemChoice
					value={$currentsemestrestore}
					label={PROMPT_SEMESTRE}
					name={DomainConstants.FIELD_SEMESTREID}
					busy={$busystore}
					items={$semestresstore}
					{onValueChanged}
				/>
			</Col>
		{/if}
		{#if $unitesstore.length > 1}
			<Col>
				<ItemChoice
					value={$currentunitestore}
					label={PROMPT_UNITE}
					name={DomainConstants.FIELD_UNITEID}
					busy={$busystore}
					items={$unitesstore}
					{onValueChanged}
				/>
			</Col>
		{/if}
		{#if $matieresstore.length > 1}
			<Col>
				<ItemChoice
					value={$currentmatierestore}
					label={PROMPT_MATIERE}
					name={DomainConstants.FIELD_MATIEREID}
					busy={$busystore}
					items={$matieresstore}
					{onValueChanged}
				/>
			</Col>
		{/if}
		{#if $groupesstore.length > 1}
			<Col>
				<ItemChoice
					value={$currentgroupestore}
					label={PROMPT_GROUPE}
					name={DomainConstants.FIELD_GROUPEID}
					busy={$busystore}
					items={$groupesstore}
					{onValueChanged}
				/>
			</Col>
		{/if}
	</Row>
</Form>
