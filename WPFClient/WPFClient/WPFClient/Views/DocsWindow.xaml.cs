using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Npgsql;
using WPFClient.Models;
using WPFClient.Connection;
using System.Collections.ObjectModel;

namespace WPFClient.Views
{
    /// <summary>
    /// Логика взаимодействия для DocsWindow.xaml
    /// </summary>
    public partial class DocsWindow : Page
    {
        private NpgsqlConnection connection;
        private string sqlGetDocuments = "select * from cmn_doc.doc";
        private string sqlGetPositionsByDocId = "select id, s_number, s_caption, f_sum" +
                                                " from cmn_doc.doc_item" +
                                                " where id_doc = :docId";
        private string sqlDeleteDocument = "select cmn_doc.doc__delete_record(:docId);";
        public static Document SelectedDocument;
        public static Position SelectedPosition;
        public static bool isAddDoc = false;
        public static bool isAddPos = false;
        public DocsWindow()
        {
            connection = PgConnection.Connection;
            InitializeComponent();
            UpdateGridViewDocuments();
        }

        private void UpdateGridViewDocuments()
        {
            //получение всех документов
            var allDocuments = GetDocuments();
            //загрузка данных в gridViewDocuments
            gridViewDocuments.ItemsSource = allDocuments;
        }

        /// <summary>
        /// Событие при выборе документа в таблице документов
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void GridViewDocuments_SelectionChanged(object sender, Telerik.Windows.Controls.SelectionChangeEventArgs e)
        {
            if (gridViewDocuments.SelectedItems.Count() > 1)
            {
                gridViewPositions.ItemsSource = null;
                btnEditDocument.IsEnabled = false;
            }
            else
            {
                btnEditDocument.IsEnabled = true;
                //смена выбранного объекта
                SelectedDocument = (Document)gridViewDocuments.SelectedItem;
                //получение позиций по id выбранного документа
                var allPositions = GetPositionsByDocId(SelectedDocument.Id);
                //загрузка данных в gridViewPositions
                gridViewPositions.ItemsSource = allPositions;
            }
        }

        /// <summary>
        /// Функция получения всех документов
        /// </summary>
        /// <returns></returns>
        private List<Document> GetDocuments()
        {
            List<Document> allDocuments = new List<Document>();
            var connection = PgConnection.Connection;
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlGetDocuments, connection))
                    {
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                allDocuments.Add(new Document(reader.GetInt32(0), 
                                    reader.IsDBNull(1) ? null : reader.GetString(1),
                                    reader.GetDateTime(2), reader.GetFloat(3), 
                                    reader.IsDBNull(4) ? null : reader.GetString(4)));
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    MessageBox.Show($"Ошибка при получении списка документов! {e.Message}");
                    return null;
                }
            }
            return allDocuments;
        }

        /// <summary>
        /// Функция получения всех позиций по id выбранного документа
        /// </summary>
        /// <param name="docId"></param>
        /// <returns></returns>
        private List<Position> GetPositionsByDocId(int docId)
        {
            List<Position> allPositions = new List<Position>();
            var connection = PgConnection.Connection;
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlGetPositionsByDocId, connection))
                    {
                        command.Parameters.AddWithValue("docId", docId);
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                allPositions.Add(new Position(reader.GetInt32(0), reader.GetString(1),
                                    reader.GetString(2), reader.GetFloat(3)));
                            }
                        }
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show($"Ошибка при получении позиций! {e.Message}");
                    return null;
                }
            }
            return allPositions;
        }

        private void DeleteDocument(Document doc)
        {
            if (connection != null)
            {
                try
                {
                    using (NpgsqlCommand command = new NpgsqlCommand(sqlDeleteDocument, connection))
                    {
                        command.Parameters.AddWithValue("docId", doc.Id);
                        command.ExecuteNonQuery();
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show($"Не удалось удалить документ '{doc.Number}'. {e.Message}");
                }
            }
        }

        /// <summary>
        /// Событие кнопки "Добавить документ"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnAddDocument_Click(object sender, RoutedEventArgs e)
        {
            isAddDoc = true;
            NavigationService.GetNavigationService(this).Navigate
                (new Uri("Views/AddEditDocForm.xaml", UriKind.RelativeOrAbsolute));
        }

        /// <summary>
        /// Событие кнопки "Редактировать документ"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnEditDocument_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedDocument != null)
            {
                isAddDoc = false;
                NavigationService.GetNavigationService(this).Navigate
                    (new Uri("Views/AddEditDocForm.xaml", UriKind.RelativeOrAbsolute));
            }
            else
                MessageBox.Show("Выберите документ для редактирования!", "", MessageBoxButton.OK,
                    MessageBoxImage.Warning);
        }

        /// <summary>
        /// Событие кнопки "Удалить документ(ы)"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnDeleteDocument_Click(object sender, RoutedEventArgs e)
        {
            if (gridViewDocuments.SelectedItems.Count() > 0)
            {
                //точно ли удалить?
                MessageBoxResult result = MessageBox.Show("Удалить выбранные документы?",
                    "Message", MessageBoxButton.YesNo);
                if (result == MessageBoxResult.Yes)
                {
                    var selectedDocuments = gridViewDocuments.SelectedItems.ToList().Cast<Document>().ToList();
                    foreach (var selectedDocument in selectedDocuments)
                    {
                        //удалить выбранный документ
                        DeleteDocument(selectedDocument);
                    }
                    btnEditDocument.IsEnabled = true;
                    SelectedDocument = null;
                    UpdateGridViewDocuments();
                }
            }
            else
                MessageBox.Show("Выберите документ(ы) для удаления!");
        }

        /// <summary>
        /// Событие кнопки "Добавить позицию"
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnAddPosition_Click(object sender, RoutedEventArgs e)
        {
            isAddPos = true;
            NavigationService.GetNavigationService(this).Navigate
                    (new Uri("Views/AddEditPositionForm.xaml", UriKind.RelativeOrAbsolute));
        }

        private void BtnEditPosition_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedPosition != null)
            {
                isAddPos = false;
                NavigationService.GetNavigationService(this).Navigate
                    (new Uri("Views/AddEditPositionForm.xaml", UriKind.RelativeOrAbsolute));
            }
            else
                MessageBox.Show("Выберите позицию для редактирования!", "", MessageBoxButton.OK,
                    MessageBoxImage.Warning);
        }

        private void GridViewPositions_SelectionChanged(object sender, Telerik.Windows.Controls.SelectionChangeEventArgs e)
        {
            if (gridViewPositions.SelectedItems.Count() > 1)
            {
                btnEditDocument.IsEnabled = false;
            }
            else
            {
                btnEditDocument.IsEnabled = true;
                //смена выбранного объекта
                SelectedPosition = (Position)gridViewPositions.SelectedItem;
            }
        }
    }
}
