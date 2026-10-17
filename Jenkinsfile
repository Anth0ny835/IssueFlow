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