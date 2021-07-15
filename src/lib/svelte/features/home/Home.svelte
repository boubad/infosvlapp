<script lang="ts">
	import { Container, Col, Form, Row } from "sveltestrap";
	import Splash from "./Splash.svelte";
	import InfoNavBar from "../InfoNavBar.svelte";
</script>

<main>
	<Container>
		<Row>
			<InfoNavBar />
		</Row>
		<Row>
			<Splash />
		</Row>
	</Container>
</main>
