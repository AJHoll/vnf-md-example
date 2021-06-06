using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WPFClient.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public DateTime Date { get; set; }
        public float Sum { get; set; }
        public string Note { get; set; }
        //public List<Position> ListPositions { get; set; }

        public Document(int id, string number, DateTime date, float sum, string note)
        {
            Id = id;
            Number = number;
            Date = date;
            Sum = sum;
            Note = note;
        }
    }
}
