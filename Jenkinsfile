pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    tools {
        nodejs 'NodeJS 22'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                    sed -i 's/\r$//' mvnw
                    chmod +x mvnw
                    ./mvnw test
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }

				stage('Docker Build') {
						steps {
								sh '''
										docker build \
												-t issueflow-backend:ci \
												.

										docker build \
												-t issueflow-frontend:ci \
												./frontend
								'''
						}
				}

				stage('Deploy') {
					steps {
						withCredentials([
							string(
								credentialsId: 'issueflow-db-password',
								variable: 'ISSUEFLOW_DB_PASSWORD'
							)
						]) {
							sh '''
								docker compose \
									-p issueflow \
									up -d --no-build
							'''
						}
					}
				}

				stage('Verify Deployment') {
					steps {
						sh '''
							echo "Waiting for IssueFlow backend..."

							for i in $(seq 1 12); do
								if curl \
									--fail \
									--silent \
									--show-error \
									http://host.docker.internal:8080/api/projects \
									> /dev/null
								then
									echo "IssueFlow backend is responding."
									exit 0
								fi

								echo "Backend not ready yet. Retrying..."
								sleep 5
							done

							echo "IssueFlow backend failed deployment verification."
							exit 1
						'''
					}
				}
    }

    post {
        success {
            echo 'IssueFlow CI pipeline completed successfully.'
        }

        failure {
            echo 'IssueFlow CI pipeline failed. Check the failed stage logs.'
        }
    }
}