const express = require('express');
const router = express.Router();
const Borrower = require('../models/Borrower');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Borrowing = require('../models/Borrowing');

router.get('/', async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        const authorCount = await Author.countDocuments();
        const borrowerCount = await Borrower.countDocuments();
        const booksWithBorrower = await Book.countDocuments({ borrower: { $ne: null } });
        const borrowersWithEmptyBooks = await Borrower.countDocuments({ books: [] });
    
        res.status(200).json({
          books: bookCount,
          authors: authorCount,
          borrowers: borrowerCount,
          booksWithBorrower: booksWithBorrower,
          borrowersWithoutBook: borrowersWithEmptyBooks,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get('/annual', async (req, res) => {
  try {
    const annualData = await Borrowing.aggregate([
      {
        $match: {
          checkoutDate: { $gte: new Date(2020, 0, 1) }
        }
      },
      {
        $group: {
          _id: { $year: '$checkoutDate' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    res.status(200).json(annualData);
  } catch (error) {
    console.error('Error fetching annual data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/monthly/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const monthlyData = await Borrowing.aggregate([
      {
        $match: {
          checkoutDate: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$checkoutDate' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    res.status(200).json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  

module.exports = router;
