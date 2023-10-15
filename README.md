# netology-library-express

### 1 запрос(ы) для вставки данных минимум о двух книгах в коллекцию books,

db.books.insertMany([
  {
    title: "1",
    description: "2",
    authors: "3"
  },
  {
    title: "4",
    description: "5",
    authors: "6"
  }
])

### 2 запрос для поиска полей документов коллекции books по полю title,

db.books.find({
  title: { $regex: '^1' }
})

### 3 запрос для редактирования полей: description и authors коллекции books по _id записи.


db.books.updateOne(
  { _id: 3 },
  { $set: {description: "new description", authors: "new authors"} }
)