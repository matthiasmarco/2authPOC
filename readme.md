# Projet OpenFaaS - COFRAP - MSPR Bloc 2

Ce projet est une preuve de concept (PoC) visant à automatiser la création et la gestion des comptes utilisateurs selon les exigences de la COFRAP. Il repose sur OpenFaaS déployé dans un cluster Kubernetes et intègre une base de données PostgreSQL.



# 1. Prérequis

- Un cluster Kubernetes (Minikube, KinD, ou K3S)
- OpenFaaS déployé sur le cluster
- `faas-cli` installé sur votre machine
- `kubectl` installé et configuré




# 2. Déploiement de PostgreSQL

Les fichiers de configuration sont dans `configs/postgresql/` :

- `postgres-configmap.yaml` : paramètres de connexion
- `postgres-deployment.yaml` : déploiement du conteneur PostgreSQL
- `postgres-service.yaml` : service exposant PostgreSQL
- `postgres-storage.yaml` : volume persistant
- `init-sql.sql` : script d’initialisation :
  - Création de la table `users`
  - Création des utilisateurs `admin`, `rw`, `ro`

### Exemple de commande pour appliquer les ressources :

```bash
kubectl apply -f configs/postgresql/
```

# 3. Création des secrets

Vous pouvez utiliser `faas-cli` :

```bash
cd secrets
echo "myuser" > db-user.txt
echo "mypassword" > db-password.txt
echo "mysecretkey" > secret-key.txt

faas-cli secret create db-user --from-file=db-user.txt
faas-cli secret create db-password --from-file=db-password.txt
faas-cli secret create secret-key --from-file=secret-key.txt
```

Ou bien kubectl :

```bash
kubectl create secret generic db-user --from-file=db-user.txt --namespace openfaas-fn
kubectl create secret generic db-password --from-file=db-password.txt --namespace openfaas-fn
kubectl create secret generic secret-key --from-file=secret-key.txt --namespace openfaas-fn
```

# 4. Déploiement des fonctions OpenFaaS
Chaque fonction est décrite dans le dossier `functions/`.

Fonctions à déployer :

- `generate-password`: Génère un mot de passe sécurisé + QRCode, chiffre les données et les stocke en base.

- `generate-2fa`: Génère un secret TOTP + QRCode et les stocke en base.

- `auth-user`: Authentifie un utilisateur via login, mot de passe, et 2FA, gère l’expiration.

Déploiement via faas-cli :

```bash
cd functions
faas-cli build -f stack.yaml
faas-cli push -f stack.yaml 
faas-cli deploy -f stack.yaml
```

# 5. Déploiement du frontend

Le frontend est une application simple qui permet de :

- Créer un utilisateur (mot de passe + 2FA)

- Authentifier un utilisateur

- Relancer la création de credentials si le compte est expiré

Instructions d’installation disponibles dans `frontend/README.md`.