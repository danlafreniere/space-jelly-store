import Head from "next/head";

import Layout from "@components/Layout";
import Header from "@components/Header";
import Container from "@components/Container";
import Button from "@components/Button";
import Image from "next/image";

import styles from "@styles/Product.module.scss";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export default function Product({ product }) {
  console.log(product);
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta
          name="description"
          content={`Find ${product.name} at Space Jelly Gear`}
        />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <Image
              width={product.image.width}
              height={product.image.height}
              src={product.image.url}
              alt=""
            />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1> console.count(first)
            <div
              className={styles.productDescription}
              dangerouslySetInnerHTML={{
                __html: product.description?.html,
              }}
            ></div>
            <p className={styles.productPrice}>${product.price}</p>
            <p className={styles.productBuy}>
              <Button>Add to Cart</Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: process.env.ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query pageProduct($slug: String!) {
        product(where: { slug: $slug }) {
          name
          price
          slug
          image
          description {
            html
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug,
    },
  });
  const product = data.product;
  return {
    props: { product },
  };
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: process.env.ENDPOINT,
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query pageProducts {
        products {
          name
          price
          slug
          image
        }
      }
    `,
  });
  const paths = data.products.map((product) => ({
    params: { productSlug: product.slug },
  }));
  return { paths, fallback: false };
}
