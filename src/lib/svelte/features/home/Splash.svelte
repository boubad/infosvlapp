<script lang="ts">
    import { Col, Container, Row } from "sveltestrap";
    import environment from "../../../../environment";
</script>

<Container>
    <Row>
        <Col width="100%">
            <img
                src={environment.splashImageUrl}
                alt={environment.splashImageAlt}
                height="100%"
            />
        </Col>
    </Row>
</Container>
