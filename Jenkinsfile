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
										sshUserPrivateKey(
												credentialsId: 'issueflow-ec2-ssh',
												keyFileVariable: 'EC2_SSH_KEY',
												usernameVariable: 'EC2_SSH_USER'
										),
										string(
												credentialsId: 'issueflow-ec2-host',
												variable: 'EC2_HOST'
										)
								]) {
										sh '''
												ssh \
														-i "$EC2_SSH_KEY" \
														-o StrictHostKeyChecking=accept-new \
														"$EC2_SSH_USER@$EC2_HOST" \
														'
																set -e

																cd ~/IssueFlow

																git pull --ff-only

																docker compose \
																		-p issueflow \
																		-f compose.aws.yaml \
																		--env-file .env.rds \
																		build

																docker compose \
																		-p issueflow \
																		-f compose.aws.yaml \
																		--env-file .env.rds \
																		up -d \
																		--remove-orphans
														'
										'''
								}
						}
				}

				stage('Verify Deployment') {
						steps {
								withCredentials([
										sshUserPrivateKey(
												credentialsId: 'issueflow-ec2-ssh',
												keyFileVariable: 'EC2_SSH_KEY',
												usernameVariable: 'EC2_SSH_USER'
										),
										string(
												credentialsId: 'issueflow-ec2-host',
												variable: 'EC2_HOST'
										)
								]) {
										sh '''
												ssh \
														-i "$EC2_SSH_KEY" \
														-o StrictHostKeyChecking=accept-new \
														"$EC2_SSH_USER@$EC2_HOST" \
														'
																set -e

																echo "Waiting for IssueFlow services..."

																for i in $(seq 1 12); do
																		if curl \
																				--fail \
																				--silent \
																				--show-error \
																				http://localhost:8080/api/projects \
																				> /dev/null \
																				2>&1; then

																				if curl \
																						--fail \
																						--silent \
																						--show-error \
																						http://localhost:3000 \
																						> /dev/null \
																						2>&1; then

																						echo "IssueFlow AWS deployment verified successfully."
																						exit 0
																				fi
																		fi

																		echo "Attempt $i/12 failed. Retrying..."
																		sleep 5
																done

																echo "IssueFlow AWS deployment verification failed."
																exit 1
														'
										'''
								}
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