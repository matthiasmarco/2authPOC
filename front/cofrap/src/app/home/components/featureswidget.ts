import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0">
        <div class="grid grid-cols-12 gap-4 justify-center">
             <div
                class="col-span-12 mb-20 p-2 md:p-20"
                style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)"
            >
                <div class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
                    <div class="text-gray-900 mb-2 text-3xl font-semibold">Bienvenue {{ username }}</div>
                    <span class="text-gray-600 text-2xl">COFRAP – Proof of Concept (POC) - Développement d’un système d’authentification sécurisé avec OpenFaaS</span>
                    <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-6" style="max-width: 800px">
                        “Dans le cadre de la MSPR Bloc 2, ce projet présente un système serverless déployé sur Kubernetes, intégrant une authentification à double facteur (2FA) et une gestion automatique des identifiants, basé sur les exigences de l’entreprise COFRAP.”
                    </p>
                    <img src="https://primefaces.org/cdn/templates/sakai/landing/peak-logo.svg" class="mt-6" alt="Company logo" />
                </div>
            </div>

            <!-- Technologies -->
            <div class="col-span-12 text-center mt-20 mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Technologies utilisées</div>
                <span class="text-muted-color text-2xl">Outils de gestion et de développement</span>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-indigo-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-jira-plain colored !text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Jira</div>
                        <span class="text-surface-600 dark:text-surface-200">Gestion des tâches et suivi de projet agile (Kanban, Gantt).</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-sky-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-kubernetes-plain !text-2xl colored"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">Kubernetes (K3S)</h5>
                        <span class="text-surface-600 dark:text-surface-200">Orchestration des conteneurs.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-palette !text-2xl text-cyan-700"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">OpenFaaS</h5>
                        <span class="text-surface-600 dark:text-surface-200">Pour le développement de fonctions serverless modulaires.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-yellow-100" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-python-plain colored text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Python</div>
                        <span class="text-surface-600 dark:text-surface-200">Langage principal pour le back-end (fonctions métiers).</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-red-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-angular-plain colored !text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Angular</div>
                        <span class="text-surface-600 dark:text-surface-200">Framework pour l’interface utilisateur (frontend).</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-postgresql-plain colored !text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">PostgresSQL</div>
                        <span class="text-surface-600 dark:text-surface-200">Base de données relationnelle pour stocker les données utilisateurs.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-gray-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-github-original colored !text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">GitHub / Docker Hub</div>
                        <span class="text-surface-600 dark:text-surface-200">Gestion du code et déploiement des images.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-vscode-plain colored !text-2xl text-blue-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">VS Code</div>
                        <span class="text-surface-600 dark:text-surface-200">Environnement de développement.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg-4 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-orange-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="devicon-postman-plain colored !text-2xl"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Postman</div>
                        <span class="text-surface-600 dark:text-surface-200">Tests dees fonctions serveless.</span>
                    </div>
                </div>
            </div>


        </div>
    </div>`
})
export class FeaturesWidget {

    public username: string = '';

    constructor(private authService: AuthService, private router: Router) {
        // Initialization logic can go here if needed
    }

    public ngOnInit() {
        const storageUsername = this.authService.getUsernameFromStorage();
        if (storageUsername) {
            this.username = storageUsername;
        } else {
            this.router.navigate(['/auth/login']); // Redirect to login if no username is found
        }
    }
}
