# Get All
```bash
kubectl get all --all-namespaces
```

# 📘 Commandes `kubectl` utiles

## 🔍 Informations générales

```bash
kubectl version                      # Affiche la version client et serveur
kubectl cluster-info                 # Infos sur le cluster
kubectl config view                  # Affiche la configuration kubectl
kubectl get all                      # Liste tous les objets de l’espace de noms courant
kubectl get namespaces               # Liste les namespaces
```

## 📦 Pods

```bash
kubectl get pods                     # Liste des pods
kubectl get pods -A                 # Pods dans tous les namespaces
kubectl describe pod <pod-name>     # Détails sur un pod
kubectl logs <pod-name>             # Logs d’un pod
kubectl logs -f <pod-name>          # Logs en direct
kubectl exec -it <pod-name> -- bash # Accès shell à un pod
kubectl delete pod <pod-name>       # Supprimer un pod
```

## 🧱 Deployments

```bash
kubectl get deployments                     # Liste des deployments
kubectl describe deployment <name>          # Détails d’un deployment
kubectl rollout restart deployment <name>   # Redémarrer un deployment
kubectl delete deployment <name>            # Supprimer un deployment
```

## 📄 Services

```bash
kubectl get svc                      # Liste des services
kubectl describe svc <name>         # Détails d’un service
kubectl delete svc <name>           # Supprimer un service
```

## 🔐 ConfigMaps & Secrets

```bash
kubectl get configmaps               # Liste des ConfigMaps
kubectl describe configmap <name>    # Détails
kubectl get secrets                  # Liste des secrets
kubectl describe secret <name>       # Détails d’un secret
kubectl get secret <name> -o yaml    # Affiche le contenu (encodé base64)
```

## 📦 Autres ressources

```bash
kubectl get nodes                    # Liste des nœuds
kubectl get events                   # Évènements récents
kubectl get ingress                  # Liste des Ingress (si utilisés)
kubectl get pvc                      # PersistentVolumeClaims
```

## 🛠️ Divers

```bash
kubectl apply -f <file.yaml>         # Créer ou mettre à jour à partir d’un manifest
kubectl delete -f <file.yaml>        # Supprimer une ressource via manifest
kubectl edit <resource>/<name>       # Modifier une ressource en ligne
kubectl explain <resource>           # Explication d’un type de ressource
```

## 🎯 Namespace

```bash
kubectl get pods -n <namespace>                     # Lister les pods d’un namespace
kubectl config set-context --current --namespace=<namespace>  # Définir le namespace par défaut
```

## 🧪 Debug & Test

```bash
kubectl port-forward <pod-name> <local-port>:<pod-port>  # Rediriger un port local
kubectl top pod                                          # Utilisation des ressources (si metrics-server actif)
```

---

> 💡 **Astuce :** Pour tout type de ressource, tu peux faire :
> ```bash
> kubectl get <type> -o yaml
> ```
> Pour voir les détails YAML de la ressource.


$ faas-cli new --lang python generate-2fa --append stack.yaml
 faas-cli new generate-2fa --lang python3-http --append stack.yaml     

faas-cli new authenticate-password --lang python3-http --append stack.yaml
faas-cli new authenticate-2fa --lang python3-http --append stack.yaml

docker run --rm -p 8081:8080 \
  -e DB_USER="cofrap_rw" \
  -e DB_PASSWORD="rw_pass" \
  -e SECRET_KEY="gkmk3aQgVZEKjzckgD1m7xYfJmE1XY7lR2K4j3PZ7lM=" \
  -e DB_NAME="cofrap" \
  -e DB_HOST="postgres" \
  96941513/generate-password


faas-cli build -f stack.yaml
faas-cli push -f stack.yaml 
faas-cli deploy -f stack.yaml

# se connecter avant à son compte docker hub (docker login --username <username>)