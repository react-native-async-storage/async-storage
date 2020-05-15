import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Persistent storage',
    imageUrl: 'img/hero_db.svg',
    description: (
      <>
        Async Storage is asynchronous, unencrypted, persistent, key-value storage solution for your React Native application.
      </>
    ),
  },
  {
    title: 'Multi-platform support',
    imageUrl: 'img/hero_box.svg',
    description: (
      <>
        Data storage solution for <strong>Android</strong>, <strong>iOS</strong>, <strong>Web</strong>, <strong>MacOS</strong> and <strong>Windows</strong>.
      </>
    ),
  },
  {
    title: 'Simple API',
    imageUrl: 'img/hero_tools.svg',
    description: (
      <>
        A handful of tools to simplify your storage flow. Easily save, read, merge and delete data at will!
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <div className={styles.featureImageContainer}>
            <img className={styles.featureImage} src={imgUrl} alt={title} />
          </div>
        </div>
      )}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}


function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Homepage for React Native Async Storage project">
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg'
              )}
              to={useBaseUrl('docs/install')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
