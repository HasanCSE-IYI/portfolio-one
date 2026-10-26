import { useRef } from 'react';
import { auth, storage, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const Home = () => {
  const form = useRef();

  const submitPortfolio = (e) => {
    e.preventDefault();
    const name = form.current[0]?.value;
    const description = form.current[1]?.value;
    const url = form.current[2]?.value;
    const image = form.current[3]?.files[0];

    if (!image) {
      savePortfolio({
        name,
        description,
        url,
        image: null
      });
      return;
    }

    const storageRef = ref(storage, `portfolio/${Date.now()}_${image.name}`);

    uploadBytes(storageRef, image).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then(
          (downloadUrl) => {
            savePortfolio({
              name,
              description,
              url,
              image: downloadUrl
            });
          },
          (error) => {
            console.error(error);
            savePortfolio({
              name,
              description,
              url,
              image: null
            });
          }
        );
      },
      (error) => {
        console.error(error);
        savePortfolio({
          name,
          description,
          url,
          image: null
        });
      }
    );
  };

  const savePortfolio = async (portfolio) => {
    try {
      await addDoc(collection(db, 'portfolio'), portfolio);
      alert('Portfolio item added successfully!');
      if (form.current) {
        form.current.reset();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add portfolio');
    }
  };

  return (
    <div className="dashboard">
      <form ref={form} onSubmit={submitPortfolio}>
        <p>
          <input type="text" placeholder="Name" required />
        </p>
        <p>
          <textarea placeholder="Description" required />
        </p>
        <p>
          <input type="text" placeholder="Url" required />
        </p>
        <p>
          <input type="file" placeholder="Image" />
        </p>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </form>
    </div>
  );
};

export default Home;
