# Backend Endpoints for Analytics Dashboard

The frontend makes 4 simple API calls. Here's what each endpoint needs to return:

## 1. GET /analytics/kpis

```json
{
  "averageProcessingTime": {
    "current": 115,
    "previous": 127,
    "change": -9.4
  },
  "fastestCategory": {
    "name": "Visitor visas",
    "time": 26,
    "change": -8.2
  },
  "slowestCategory": {
    "name": "Family visas",
    "time": 258,
    "change": -17.3
  },
  "totalVisaTypes": {
    "current": 45,
    "previous": 43,
    "change": 4.7
  }
}
```

## 2. GET /analytics/trends

```json
[
  {
    "date": "2024-01-01",
    "Visitor visas": 28,
    "Student visas": 156,
    "Family visas": 312,
    "Work visas": 89,
    "Other visas": 45
  },
  {
    "date": "2024-01-02",
    "Visitor visas": 27,
    "Student visas": 158,
    "Family visas": 310,
    "Work visas": 91,
    "Other visas": 44
  }
]
```

## 3. GET /analytics/comparison

```json
[
  {
    "category": "Visitor visas",
    "median_90": 26,
    "median_50": 14,
    "change": -8.2
  },
  {
    "category": "Student visas",
    "median_90": 153,
    "median_50": 89,
    "change": 2.1
  },
  {
    "category": "Family visas",
    "median_90": 258,
    "median_50": 145,
    "change": -17.3
  }
]
```

## 4. GET /analytics/distribution

```json
[
  {
    "range": "0-30 days",
    "count": 15,
    "percentage": 22.1
  },
  {
    "range": "31-60 days",
    "count": 18,
    "percentage": 26.9
  },
  {
    "range": "61-90 days",
    "count": 12,
    "percentage": 21.7
  },
  {
    "range": "91-120 days",
    "count": 8,
    "percentage": 15.0
  },
  {
    "range": "121-180 days",
    "count": 6,
    "percentage": 9.7
  },
  {
    "range": "180+ days",
    "count": 3,
    "percentage": 4.6
  }
]
```

That's it. The frontend is ready and will work as soon as you implement these 4 endpoints. 