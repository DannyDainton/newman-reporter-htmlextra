# htmlextra docker image

A basic Docker image to get started using the `htmlextra` reporter to run your Postman collections.

### Basic Usage

```bash
docker run -it -v $(pwd)/reports:/etc/newman dannydainton/htmlextra run <URL LINK TO COLLECTION> --reporters="htmlextra" --reporter-htmlextra-export="newman-report.html"
```