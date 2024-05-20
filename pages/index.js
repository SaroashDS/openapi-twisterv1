import React from 'react'
import Head from "next/head"

import Header from "../components/Header"
import Main from "../components/Main"
import Footer from "../components/Footer"

const baseUrl = 'https://p2o.defcon007.com',
    newTitle = 'TWIST : P to OA',
    newDescription = '...';

class IndexPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isArticleVisible: false,
            timeout: false,
            articleTimeout: false,
            article: "",
            loading: "is-loading"
        }
        this.handleOpenArticle = this.handleOpenArticle.bind(this)
        this.handleCloseArticle = this.handleCloseArticle.bind(this)
    }

    componentDidMount() {
        this.timeoutId = setTimeout(() => {
            this.setState({ loading: "" })
        }, 100)
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
    }

    handleOpenArticle(article) {
        this.setState({
            isArticleVisible: !this.state.isArticleVisible,
            article
        })

        setTimeout(() => {
            this.setState({
                timeout: !this.state.timeout
            })
        }, 325)

        setTimeout(() => {
            this.setState({
                articleTimeout: !this.state.articleTimeout
            })
        }, 350)
    }

    handleCloseArticle() {
        this.setState({
            articleTimeout: !this.state.articleTimeout
        })

        setTimeout(() => {
            this.setState({
                timeout: !this.state.timeout
            })
        }, 325)

        setTimeout(() => {
            this.setState({
                isArticleVisible: !this.state.isArticleVisible,
                article: ""
            })
        }, 350)
    }
    render() {
        return (
            <div className={`body ${this.state.loading} ${this.state.isArticleVisible ? "is-article-visible" : ""}`}>
                <div>
                    <Head>
                        {/* Primary Meta Tags */}
                        <title>{newTitle}</title>
                        <meta name="title" content={newTitle} />
                        <meta name="description" content={newDescription} />

                        {/* Open Graph / Facebook */}
                        <meta property="og:type" content="website" />
                        <meta property="og:url" content={baseUrl} />
                        <meta property="og:title" content={newTitle} />
                        <meta property="og:description" content={newDescription} />
                        <meta property="og:image" content={baseUrl + '/images/cover-image.jpg'} />

                        {/* Twitter */}
                        <meta property="twitter:card" content="summary_large_image" />
                        <meta property="twitter:url" content={baseUrl} />
                        <meta property="twitter:title" content={newTitle} />
                        <meta property="twitter:description" content={newDescription} />
                        <meta property="twitter:image" content={baseUrl + '/images/cover-image.jpg'} />
                    </Head>

                    <div id="wrapper">
                        <Header onOpenArticle={this.handleOpenArticle} timeout={this.state.timeout} />
                        <Main
                            isArticleVisible={this.state.isArticleVisible}
                            timeout={this.state.timeout}
                            articleTimeout={this.state.articleTimeout}
                            article={this.state.article}
                            onCloseArticle={this.handleCloseArticle}
                        />
                        <Footer timeout={this.state.timeout} />
                    </div>

                    <div id="bg" />
                </div>
            </div>
        )
    }
}

export default IndexPage
