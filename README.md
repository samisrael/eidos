

# eidos - Multimodal Deep Learning Framework for Web Based Taxonomic Recognition  

Image and Audio Based Species Identification

This project identifies animals, birds, and plants from image and audio inputs.  
It uses a web application built with ReactJS and NodeJS and a deep learning model built with TensorFlow.  
Both image and audio pipelines are supported.


## Features

- Image upload for species classification  
- Audio upload for bioacoustic species recognition  
- TensorFlow model for image and audio inference  
- Docker container for model serving  
- ReactJS frontend  
- ExpressJS API backend  
- MongoDB for user data, uploads, and prediction logs  
- Simple and clean web UI  
- JWT based authentication  
- Support for future species expansion  


## System Architecture

1. **Frontend**  
   ReactJS.  
   Handles file upload and displays prediction results.

2. **Backend**  
   NodeJS with Express.  
   Handles auth, routing, media storage, and MongoDB operations.

3. **ML Model**  
   TensorFlow CNN for image classification.  
   TensorFlow CNN plus RNN for audio classification.  
   Served inside a Docker container.

4. **Database**  
   MongoDB for all metadata.



## Tech Stack

### Application  
- ReactJS  
- NodeJS  
- ExpressJS  
- MongoDB  
- JWT Auth  
- Axios for HTTP  
- Multer for file upload  

### Machine Learning  
- Python  
- TensorFlow  
- Numpy  
- Spectrogram conversion for audio  
- Transfer learning for images  
- Docker for model serving  



## Project Structure

```
root/
│
├── client/               # ReactJS frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/               # NodeJS Express backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/           # MongoDB schema
│   └── server.js
│
├── ml-model/             # TensorFlow model
│   ├── image_model/
│   ├── audio_model/
│   ├── preprocess/
│   ├── train/
│   └── dockerfile
│
├── docker-compose.yml
└── README.md
```

## How It Works

### Image input  
User uploads an image.  
The backend sends the file to the model server.  
Model returns species and confidence scores.

### Audio input  
User uploads a sound recording.  
Backend converts audio to a spectrogram.  
The model predicts the species from acoustic features.

All results are saved in MongoDB.


## Installation

### 1. Clone this repository  


git clone [https://github.com/samisrael/eidos](https://github.com/samisrael/eidos)

cd your-repo


### 2. Install frontend  

```bash
cd client
npm install
```

### 3. Install backend  
```bash
cd ../server
npm install
```

### 4. Install machine learning environment (optional for dev)  
```bash
cd ../ml-model
pip install -r requirements.txt
```

## Running the Application

### Start backend  
```bash
cd server
npm start
```
### Start frontend  
```bash
cd client
npm start
```
### Start ML model with Docker  
```bash
cd ml-model
docker build -t species-model .
docker run -p 8501:8501 species-model
```

## API Endpoints

### POST `/api/auth/register`  
User registration.

### POST `/api/auth/login`  
User login.

### POST `/api/predict/image`  
Image file upload.  
Returns predicted species.

### POST `/api/predict/audio`  
Audio file upload.  
Returns predicted species.

### GET `/api/user/history`  
Returns past predictions for the user.



## MongoDB Collections

- `users`  
- `uploads`  
- `predictions`  
- `logs`

Each prediction stores:

```

{
userId,
fileType,
species,
confidence,
modelVersion,
timestamp
}

```

---

## Training the Model

Training scripts are in `ml-model/train/`.

### Image model  
- Uses transfer learning  
- ResNet or MobileNet

### Audio model  
- Converts audio to spectrogram  
- CNN plus LSTM

Run training:

```

python train_image.py
python train_audio.py

```


## Future Improvements

- Add real time inference  
- Add more species datasets  
- Add ensemble fusion between image and audio  
- Add admin dashboard  
- Add feedback loop for improving accuracy  

---

## Contributors

- Sam Israel D
- Bala Murugan P
- Vijay Kumar B


## License

This project is for academic use.

