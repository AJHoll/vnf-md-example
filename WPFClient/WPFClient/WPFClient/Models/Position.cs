using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WPFClient.Models
{
    public class Position
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public float Sum { get; set; }

        public Position(int id, string number, string name, float sum)
        {
            Id = id;
            Number = number;
            Name = name;
            Sum = sum;
        }
    }
}
