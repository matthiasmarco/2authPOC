helm repo add grafana https://grafana.github.io/helm-charts
helm repo update


helm install grafana grafana/grafana \
  --namespace openfaas \
  --create-namespace \
  -f grafana-values.yaml
